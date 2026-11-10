"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./inventory.css";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const emptyForm = { product_id: "", name: "", category: "", description: "", price: "", stock: "" };
const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value) || 0);
const dateLabel = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

function Icon({ kind, size = 18 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></>,
    box: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    edit: <><path d="m15 5 4 4M4 20l4-.8L19 8l-3-3L5 16l-1 4Z"/></>,
    trash: <><path d="M4 7h16M10 11v6M14 11v6M5 7l1 14h12l1-14M9 7V4h6v3"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    filter: <><path d="M4 7h16M7 12h10m-7 5h4"/><circle cx="8" cy="7" r="1"/><circle cx="15" cy="12" r="1"/></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}

export default function InventoryPage() {
  const [token, setToken] = useState("");
  const [tokenDraft, setTokenDraft] = useState("");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [products, setProducts] = useState([]);
  const [visitorCount, setVisitorCount] = useState(null);
  const [status, setStatus] = useState("loading");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sort, setSort] = useState("updated");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const fileRef = useRef(null);
  const pageSize = 8;

  useEffect(() => {
    const storedToken = sessionStorage.getItem("valtoro_inventory_token") || "";
    setToken(storedToken);
    if (storedToken) loadProducts(storedToken);
    else setStatus("auth");
  }, []);
  const notify = (message, type = "success") => { setToast({ message, type }); window.setTimeout(() => setToast(null), 3800); };

  const loadProducts = useCallback(async (auth = token) => {
    if (!auth) { setStatus("auth"); return; }
    setStatus("loading");
    try {
      const response = await fetch(`${API}/api/inventory/products`, { headers: { Authorization: `Bearer ${auth}` }, cache: "no-store" });
      if (response.status === 401) { sessionStorage.removeItem("valtoro_inventory_token"); setToken(""); setStatus("auth"); notify("Admin token was not accepted", "error"); return; }
      const body = await response.json();
      if (!response.ok) throw new Error(body.detail || "Inventory could not be loaded");
      setProducts(body.products || []); setStatus("ready");
      const identifiedAdmin = body.admin || sessionStorage.getItem("valtoro_inventory_admin") || "Administrator";
      sessionStorage.setItem("valtoro_inventory_admin", identifiedAdmin);
      setAdminName(identifiedAdmin);
      setAdminName(sessionStorage.getItem("valtoro_inventory_admin") || body.admin || "Administrator");
    } catch (error) { setStatus("error"); notify(error.message || "Inventory could not be loaded", "error"); }
  }, [token]);

  useEffect(() => { if (token) loadProducts(token); else setStatus("auth"); }, [token]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetch("/api/visitor-count", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.detail || "Could not load visitor count");
        if (!cancelled) setVisitorCount(Number(body.total_visitors) || 0);
      })
      .catch(() => { if (!cancelled) setVisitorCount(null); });
    return () => { cancelled = true; };
  }, [token]);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(), [products]);
  const lowCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outCount = products.filter((p) => p.stock === 0).length;
  const stockTotal = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  const visible = useMemo(() => {
    const result = products.filter((p) => {
      const matchesQuery = `${p.name} ${p.product_id}`.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || p.category === category;
      const matchesStock = stockFilter === "all" || (stockFilter === "low" ? p.stock > 0 && p.stock <= 10 : stockFilter === "out" ? p.stock === 0 : p.stock > 10);
      return matchesQuery && matchesCategory && matchesStock;
    });
    return result.sort((a, b) => sort === "price" ? a.price - b.price : sort === "stock" ? a.stock - b.stock : new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
  }, [products, query, category, stockFilter, sort]);
  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const shown = visible.slice((page - 1) * pageSize, page * pageSize);

  function setField(event) { setForm((old) => ({ ...old, [event.target.name]: event.target.value })); }
  function openCreate() { setEditing(null); setForm(emptyForm); setFile(null); setPreview(""); setModal(true); }
  function openEdit(product) { setEditing(product); setForm({ product_id: product.product_id, name: product.name, category: product.category || "", description: product.description || "", price: product.price, stock: product.stock }); setFile(null); setPreview(product.image_url || ""); setModal(true); }
  function chooseFile(event) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (!/^image\/(jpeg|png|webp)$/i.test(selected.type) || !/\.(jpe?g|png|webp)$/i.test(selected.name)) { notify("Choose a JPG, PNG, or WEBP image", "error"); event.target.value = ""; return; }
    if (selected.size > 5 * 1024 * 1024) { notify("Image must be 5 MB or smaller", "error"); event.target.value = ""; return; }
    setFile(selected); setPreview(URL.createObjectURL(selected));
  }

  async function submitProduct(event) {
    event.preventDefault(); if (busy) return;
    if (!editing && !file) { notify("Choose a product image before saving", "error"); return; }
    setBusy(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => { if (key !== "product_id" || !editing) body.append(key, value); });
      if (file) body.append("image", file);
      const path = editing ? `/api/inventory/products/${encodeURIComponent(editing.product_id)}` : "/api/inventory/products";
      const response = await fetch(`${API}${path}`, { method: editing ? "PUT" : "POST", headers: { Authorization: `Bearer ${token}` }, body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "Product could not be saved");
      setModal(false); notify(editing ? "Product updated successfully" : "Product added successfully"); await loadProducts();
    } catch (error) { notify(error.message || "Product could not be saved", "error"); }
    finally { setBusy(false); }
  }

  async function removeProduct(product) {
    if (!window.confirm(`Delete “${product.name}” (${product.product_id}) and its product image?`)) return;
    try {
      const response = await fetch(`${API}/api/inventory/products/${encodeURIComponent(product.product_id)}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const body = await response.json(); if (!response.ok) throw new Error(body.detail || "Product could not be deleted");
      notify("Product deleted"); await loadProducts();
    } catch (error) { notify(error.message || "Product could not be deleted", "error"); }
  }

  async function connectAdmin(event) {
    event.preventDefault();
    const value = tokenDraft.trim(); if (!value) return;
    setAuthBusy(true); setAuthError("");
    try {
      const response = await fetch(`${API}/api/inventory/products`, { headers: { Authorization: `Bearer ${value}` }, cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.detail || (response.status === 401 ? "Admin key was not recognized" : "Could not connect to inventory API"));
      sessionStorage.setItem("valtoro_inventory_token", value);
      sessionStorage.setItem("valtoro_inventory_admin", body.admin || "Administrator");
      setAdminName(body.admin || "Administrator"); setProducts(body.products || []); setStatus("ready"); setToken(value); setTokenDraft("");
    } catch (error) { setAuthError(error.message || "Could not connect to inventory API"); }
    finally { setAuthBusy(false); }
  }
  function disconnectAdmin() { sessionStorage.removeItem("valtoro_inventory_token"); sessionStorage.removeItem("valtoro_inventory_admin"); setAdminName(""); setToken(""); setProducts([]); }

  if (status === "auth") return <main className="inventory-auth"><form className="auth-card" onSubmit={connectAdmin}><a className="inventory-brand" href="/">VALTORO<span>INVENTORY</span></a><div className="auth-mark"><Icon kind="box" size={25}/></div><p className="inventory-eyebrow">ADMINISTRATION</p><h1>Inventory management</h1><p className="auth-copy">Enter your admin access token to manage the product catalog.</p><label htmlFor="admin-token">Admin token</label><input id="admin-token" type="password" autoComplete="current-password" value={tokenDraft} onChange={(e) => { setTokenDraft(e.target.value); setAuthError(""); }} placeholder="Enter secure token" required/>{authError && <p className="auth-error" role="alert">{authError}</p>}<button className="primary-button auth-submit" type="submit" disabled={authBusy}>{authBusy && <span className="button-spinner"/>}{authBusy ? "Connecting…" : <>Continue <Icon kind="chevron"/></>}</button><a className="store-link" href="/">← Back to storefront</a></form></main>;

  return <div className="inventory-shell">
    <aside className="inventory-sidebar"><a className="inventory-brand" href="/">VALTORO<span>INVENTORY</span></a><div className="sidebar-label">WORKSPACE</div><a className="sidebar-link" href="/"><Icon kind="grid"/> Storefront</a><a className="sidebar-link selected" href="/inventory"><Icon kind="box"/> Inventory <span className="sidebar-count">{products.length}</span></a><div className="sidebar-bottom"><div className="admin-avatar">{adminName.slice(0, 1).toUpperCase()}</div><div className="admin-details"><strong>{adminName || "Administrator"}</strong><span>Inventory access</span></div><button aria-label="Sign out" className="icon-button" onClick={disconnectAdmin}><Icon kind="logout"/></button></div></aside>
    <main className="inventory-main"><header className="inventory-topbar"><div className="breadcrumbs">Workspace <Icon kind="chevron" size={13}/> <strong>Inventory</strong></div><div className="topbar-right"><span className="live-status"><i/> Live inventory</span><span className="today-label">{new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span></div></header>
      <section className="inventory-content"><div className="inventory-heading"><div><p className="inventory-eyebrow">CATALOG MANAGEMENT</p><h1>Inventory</h1><p className="inventory-subtitle">Manage your products, stock levels and catalog details.</p></div><button className="primary-button" onClick={openCreate}><Icon kind="plus"/> Add product</button></div>
      <div className="stats-grid"><article className="stat-card"><div className="stat-heading"><span>Total products</span><span className="stat-icon lilac"><Icon kind="box"/></span></div><strong>{products.length}</strong><small>Products in your catalog</small></article><article className="stat-card"><div className="stat-heading"><span>Available stock</span><span className="stat-icon blue"><Icon kind="grid"/></span></div><strong>{stockTotal.toLocaleString("en-IN")}</strong><small>Units across all products</small></article><article className="stat-card"><div className="stat-heading"><span>Running low</span><span className="stat-icon amber"><Icon kind="filter"/></span></div><strong>{lowCount}</strong><small>Products with 1–10 units</small></article><article className="stat-card"><div className="stat-heading"><span>Out of stock</span><span className="stat-icon rose"><Icon kind="box"/></span></div><strong>{outCount}</strong><small>Products need restocking</small></article><article className="stat-card"><div className="stat-heading"><span>Storefront views</span><span className="stat-icon green"><Icon kind="grid"/></span></div><strong>{visitorCount === null ? "—" : visitorCount.toLocaleString("en-IN")}</strong><small>Total visits · dashboard excluded</small></article></div>
      <section className="products-panel"><div className="products-title"><div><h2>All products <span>{products.length}</span></h2><p>View and manage your product catalog</p></div><button className="refresh-button" onClick={() => loadProducts()} aria-label="Refresh inventory">↻</button></div><div className="toolbar"><label className="search-box"><Icon kind="search"/><input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search products or ID…"/></label><label className="filter-select"><Icon kind="filter"/><select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}><option value="all">All categories</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></label><select className="filter-select stock-select" value={stockFilter} onChange={(e) => { setStockFilter(e.target.value); setPage(1); }}><option value="all">All stock</option><option value="in">In stock</option><option value="low">Low stock</option><option value="out">Out of stock</option></select><select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products"><option value="updated">Recently updated</option><option value="price">Price: low to high</option><option value="stock">Stock: low to high</option></select></div>
      {status === "loading" ? <div className="table-state"><span className="spinner"/> Loading inventory…</div> : status === "error" ? <div className="table-state"><span>We couldn’t load your inventory.</span><button className="text-button" onClick={() => loadProducts()}>Try again</button></div> : shown.length === 0 ? <div className="empty-state"><div className="empty-icon"><Icon kind="box" size={26}/></div><h3>{products.length ? "No products match your filters" : "Your inventory is ready"}</h3><p>{products.length ? "Try changing your search or filters." : "Add your first product to get your catalog moving."}</p>{!products.length && <button className="primary-button" onClick={openCreate}><Icon kind="plus"/> Add your first product</button>}</div> : <><div className="table-wrap"><table><thead><tr><th>PRODUCT</th><th>PRODUCT ID</th><th>CATEGORY</th><th>PRICE</th><th>AVAILABLE STOCK</th><th>LAST UPDATED</th><th/></tr></thead><tbody>{shown.map((p) => <tr key={p.product_id}><td><div className="product-cell"><div className="product-thumb">{p.image_url ? <img src={p.image_url} alt=""/> : <Icon kind="image"/>}</div><div className="product-name"><strong>{p.name}</strong><span>{p.description || "—"}</span></div></div></td><td><span className="id-tag">{p.product_id}</span></td><td><span className="category-tag">{p.category || "Uncategorized"}</span></td><td className="price-cell">{money(p.price)}</td><td><span className={`stock-badge ${p.stock === 0 ? "out" : p.stock <= 10 ? "low" : "available"}`}><i/>{p.stock === 0 ? "Out of stock" : `${p.stock} units`}</span></td><td className="date-cell">{dateLabel(p.updated_at)}</td><td><div className="row-actions"><button aria-label={`Edit ${p.name}`} onClick={() => openEdit(p)}><Icon kind="edit" size={16}/></button><button aria-label={`Delete ${p.name}`} onClick={() => removeProduct(p)}><Icon kind="trash" size={16}/></button></div></td></tr>)}</tbody></table></div><div className="pagination"><span>Showing <strong>{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, visible.length)}</strong> of <strong>{visible.length}</strong> products</span><div><button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span>{page} / {totalPages}</span><button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button></div></div></>}</section><p className="inventory-footnote">Product images are stored in the connected GitHub repository.</p></section>
    </main>
    {modal && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) setModal(false); }}><section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title"><header className="modal-header"><div><p className="inventory-eyebrow">PRODUCT DETAILS</p><h2 id="product-modal-title">{editing ? "Edit product" : "Add a product"}</h2></div><button className="icon-button modal-close" disabled={busy} onClick={() => setModal(false)} aria-label="Close"><Icon kind="close"/></button></header><form onSubmit={submitProduct}><div className="modal-body"><div className="form-grid"><label>Product name <em>*</em><input name="name" value={form.name} onChange={setField} placeholder="e.g. Classic Black" maxLength={160} required/></label><label>Product ID {!editing && <em>*</em>}<input name="product_id" value={form.product_id} onChange={setField} placeholder="e.g. VT-010" maxLength={80} required={!editing} disabled={!!editing}/>{editing && <small>Product ID can’t be changed.</small>}</label><label>Category<input name="category" value={form.category} onChange={setField} placeholder="e.g. Everyday" maxLength={100}/></label><label>Price (₹) <em>*</em><input name="price" type="number" min="0" step="0.01" value={form.price} onChange={setField} placeholder="0.00" required/></label><label>Available stock <em>*</em><input name="stock" type="number" min="0" step="1" value={form.stock} onChange={setField} placeholder="0" required/></label><label className="full-field">Description<textarea name="description" rows="3" value={form.description} onChange={setField} maxLength={3000} placeholder="Add product details…"/></label><div className="full-field image-field"><span>Product image {!editing && <em>*</em>}</span><input ref={fileRef} className="file-input" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={chooseFile}/>{preview ? <div className="preview-row"><img src={preview} alt="Product preview"/><div><strong>{file?.name || "Current product image"}</strong><span>{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB · Ready to upload` : "Select a new image to replace it"}</span><button type="button" className="text-button" onClick={() => fileRef.current?.click()}>Replace image</button></div></div> : <button type="button" className="upload-zone" onClick={() => fileRef.current?.click()}><span><Icon kind="image" size={21}/></span><strong>Click to upload an image</strong><small>JPG, PNG or WEBP · Up to 5 MB</small></button>}<small className="image-help">Image uploads to GitHub when you save the product.</small></div></div></div><footer className="modal-footer"><button type="button" className="secondary-button" onClick={() => setModal(false)} disabled={busy}>Cancel</button><button type="submit" className="primary-button" disabled={busy}>{busy && <span className="button-spinner"/>}{busy ? "Uploading & saving…" : editing ? "Save changes" : "Add product"}</button></footer></form></section></div>}
    {toast && <div className={`toast ${toast.type}`} role="status"><span>{toast.type === "error" ? "!" : "✓"}</span>{toast.message}</div>}
  </div>;
}
