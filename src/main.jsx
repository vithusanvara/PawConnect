import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowRight, Cat, Dog, Heart, LogOut, MapPin, PawPrint, Plus, X } from 'lucide-react';
import './style.css';
import { samplePets } from './samplePets.js';

const preview = import.meta.env.MODE === 'preview';
const previewPets = samplePets.map(pet => ({ ...pet, _id: pet.name.toLowerCase() }));

const statuses = ['Available', 'Adoption Pending', 'Adopted'];
const blankPet = { name: '', species: 'Dog', age: '', location: '', description: '', image: '', status: 'Available' };

async function api(path, { token, body, method = 'GET' } = {}) {
  const headers = {};
  if (token) headers.Authorization = 'Bearer ' + token;
  if (body) headers['Content-Type'] = 'application/json';
  const response = await fetch('/api' + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (response.status === 204) return;
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('The adoption API is unavailable.');
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

function Brand() {
  return <a className="brand" href="#" aria-label="PawConnect home"><span><PawPrint size={23} /></span><b>Paw<strong>Connect</strong></b></a>;
}

function PetPhoto({ pet }) {
  const [broken, setBroken] = useState(false);
  return pet.image && !broken ? <img src={pet.image} alt={pet.name + ', a rescue ' + pet.species.toLowerCase()} onError={() => setBroken(true)} /> : <div className="photo-placeholder"><PawPrint size={50} /></div>;
}

function Modal({ title, close, children }) {
  const dialog = React.useRef(null);
  useEffect(() => { dialog.current.showModal(); }, []);
  return <dialog ref={dialog} onCancel={close}><div className="dialog-head"><h2>{title}</h2><button type="button" className="icon-button" onClick={close} aria-label="Close"><X /></button></div>{children}</dialog>;
}

function Login({ close, onLogin }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const body = Object.fromEntries(new FormData(event.currentTarget));
      onLogin(await api('/users/login', { method: 'POST', body }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return <Modal title="Rescue staff sign in" close={close}>
    <p>Sign in to manage the pets you’ve listed.</p>
    <form onSubmit={submit}>
      <label>Email<input name="email" type="email" autoComplete="username" required /></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
  </Modal>;
}

function ListingEditor({ pet, close, save }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await save(pet._id, Object.fromEntries(new FormData(event.currentTarget)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return <Modal title={pet._id ? 'Edit listing' : 'Add a pet'} close={close}>
    <form onSubmit={submit}>
      <div className="fields">
        <label>Name<input name="name" defaultValue={pet.name} maxLength={80} required /></label>
        <label>Species<select name="species" defaultValue={pet.species}><option>Dog</option><option>Cat</option></select></label>
        <label>Age<input name="age" defaultValue={pet.age} placeholder="e.g. 2 years" maxLength={40} required /></label>
        <label>Location<input name="location" defaultValue={pet.location} placeholder="e.g. Toronto, ON" maxLength={100} required /></label>
      </div>
      <label>Photo URL<input name="image" defaultValue={pet.image} placeholder="https://…" maxLength={1000} /></label>
      <label>Status<select name="status" defaultValue={pet.status}>{statuses.map(status => <option key={status}>{status}</option>)}</select></label>
      <label>Description<textarea name="description" defaultValue={pet.description} maxLength={1500} rows={4} required /></label>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="primary" disabled={busy}>{busy ? 'Saving…' : 'Save listing'}</button>
    </form>
  </Modal>;
}

function App() {
  const [pets, setPets] = useState(preview ? previewPets : []);
  const [filter, setFilter] = useState('All pets');
  const [selected, setSelected] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [dashboard, setDashboard] = useState(false);
  const [editor, setEditor] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(!preview);
  const [error, setError] = useState('');
  const [dashboardError, setDashboardError] = useState('');
  const [message, setMessage] = useState('');

  async function refresh() {
    setLoading(true);
    setError('');
    try { setPets(await api('/pets')); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (!preview) refresh(); }, []);
  const shown = pets.filter(pet => filter === 'All pets' || pet.species + 's' === filter);
  const mine = pets.filter(pet => pet.owner === session?.user.id);

  function showDashboard() {
    setDashboard(true);
    setDashboardError('');
    setMessage('');
    window.scrollTo(0, 0);
  }

  function signIn(data) {
    setSession(data);
    setLoginOpen(false);
    if (data.user.role === 'staff') showDashboard();
  }

  async function openPet(id) {
    if (preview) {
      setSelected(previewPets.find(pet => pet._id === id));
      return;
    }
    setError('');
    try { setSelected(await api('/pets/' + id)); }
    catch (err) { setError(err.message); }
  }

  async function save(id, body) {
    const pet = await api('/pets' + (id ? '/' + id : ''), { token: session.token, method: id ? 'PATCH' : 'POST', body });
    setPets(current => id ? current.map(item => item._id === id ? pet : item) : [pet, ...current]);
    setEditor(null);
    setMessage(id ? 'Listing updated.' : 'Listing added.');
  }

  async function remove() {
    setBusy(true);
    setDashboardError('');
    try {
      await api('/pets/' + deleting._id, { token: session.token, method: 'DELETE' });
      setPets(current => current.filter(pet => pet._id !== deleting._id));
      setMessage('Listing deleted.');
    } catch (err) {
      setDashboardError(err.message);
    } finally {
      setBusy(false);
      setDeleting(null);
    }
  }

  return <>
    <header><div className="wrap nav">
      <div onClick={() => setDashboard(false)}><Brand /></div>
      <nav aria-label="Main navigation">
        <a href={dashboard ? '#' : '#pets'} onClick={() => setDashboard(false)}>Browse pets</a>
        {session?.user.role === 'staff' && <button className="outline" onClick={showDashboard}>Dashboard</button>}
        {!preview && (session ? <button className="outline" onClick={() => { setSession(null); setDashboard(false); }}><LogOut size={16} /> Sign out</button> : <button className="outline" onClick={() => setLoginOpen(true)}>Staff sign in <ArrowRight size={16} /></button>)}
      </nav>
    </div></header>

    {dashboard ? <main className="wrap dashboard">
      <div className="section-head"><div><h1>Manage listings</h1><p>Signed in as {session.user.email}</p></div><button className="primary" onClick={() => setEditor(blankPet)}><Plus size={18} /> Add a pet</button></div>
      {message && <p className="notice" role="status">{message}</p>}
      {dashboardError && <p className="error" role="alert">{dashboardError}</p>}
      {error && <p className="error" role="alert">{error} <button onClick={refresh}>Retry</button></p>}
      {loading && <p role="status">Loading listings…</p>}
      {!loading && !error && !mine.length && <p className="empty">Your listings will appear here after you add a pet.</p>}
      <div className="listing-list">{mine.map(pet => <article className="listing-row" key={pet._id}>
        <div className="thumbnail"><PetPhoto pet={pet} /></div>
        <div><h2>{pet.name}</h2><p>{pet.species} · {pet.status}</p></div>
        <div className="row-actions"><button className="outline" onClick={() => setEditor(pet)}>Edit</button><button className="outline danger" onClick={() => setDeleting(pet)}>Delete</button></div>
      </article>)}</div>
    </main> : <main>
      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow"><Heart size={15} /> Rescue pet adoption</div>
          <h1>Find your new<br /> <em>best friend.</em></h1>
          <p>Meet rescued dogs and cats in the GTA who are ready for a second chance and a place to call home.</p>
          <a className="primary" href="#pets">Meet the pets <ArrowDown size={18} /></a>
        </div>
        <div className="hero-photo"><img src="/images/hero.jpg" alt="Golden retriever puppy looking toward the camera" /></div>
      </section>
      <section className="pets-section" id="pets"><div className="wrap">
        <div className="section-head"><div><h2>Meet the pets</h2><p>Browse dogs and cats listed by rescue staff.</p></div>
          <div className="filters" aria-label="Filter by species">
            {[['All pets', PawPrint], ['Dogs', Dog], ['Cats', Cat]].map(([label, Icon]) => <button key={label} type="button" aria-pressed={filter === label} onClick={() => setFilter(label)}><Icon size={16} /> {label}</button>)}
          </div>
        </div>
        {loading && <p className="empty" role="status">Loading pets…</p>}
        {error && <p className="error" role="alert">{error} <button onClick={refresh}>Retry</button></p>}
        {!loading && !error && !shown.length && <p className="empty">There are no {filter === 'All pets' ? 'pets' : filter.toLowerCase()} listed yet.</p>}
        <div className="grid">{shown.map(pet => <article className="pet-card" key={pet._id}>
          <div className="pet-photo"><PetPhoto pet={pet} /><span className={'status ' + (pet.status === 'Available' ? 'available' : '')}>{pet.status}</span></div>
          <div className="card-body"><p className="pet-meta">{pet.species} · {pet.age}</p><h3>{pet.name}</h3><p className="location"><MapPin size={16} />{pet.location}</p><button className="text-button" onClick={() => openPet(pet._id)}>Meet {pet.name} <ArrowRight size={17} /></button></div>
        </article>)}</div>
      </div></section>
    </main>}

    <footer><div className="wrap footer"><div onClick={() => setDashboard(false)}><Brand /></div><p>COMP229 student prototype · {preview ? 'Catalog preview' : 'Demo listings'}</p></div></footer>
    {loginOpen && <Login close={() => setLoginOpen(false)} onLogin={signIn} />}
    {editor && <ListingEditor pet={editor} close={() => setEditor(null)} save={save} />}
    {selected && <Modal title={'Meet ' + selected.name} close={() => setSelected(null)}><div className="detail-photo"><PetPhoto pet={selected} /></div><p className="pet-meta">{selected.species} · {selected.age} · {selected.status}</p><p className="location"><MapPin size={16} />{selected.location}</p><p>{selected.description}</p></Modal>}
    {deleting && <Modal title={'Delete ' + deleting.name + '’s listing?'} close={() => { if (!busy) setDeleting(null); }}><p>This removes the listing from the public browse page.</p><div className="row-actions"><button className="outline" disabled={busy} onClick={() => setDeleting(null)}>Cancel</button><button className="primary" disabled={busy} onClick={remove}>{busy ? 'Deleting…' : 'Delete listing'}</button></div></Modal>}
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
