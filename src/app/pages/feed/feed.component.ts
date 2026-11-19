import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Post } from '../../core/post.model';
import { PostsService } from '../../core/posts.service';

@Component({
  standalone: true,
  selector: 'app-feed',
  imports: [FormsModule],
  template: `
  <div class="app-shell">
    <header class="topbar">
      <a class="brand" href="/posts"><span class="brand-icon">S</span> MiniTwitter</a>
      <div class="user-area">
        <span class="welcome">Hola, {{ auth.getUsername() }}</span>
        <button class="btn btn-outline-secondary btn-sm" (click)="auth.logout()">Cerrar sesión</button>
      </div>
    </header>

    <main class="feed-container">
      <div class="page-heading">
        <div><h1>Tu muro</h1><p>Comparte una idea con la comunidad.</p></div>
        <span class="post-count">{{ posts.length }} publicaciones</span>
      </div>

      <section class="card composer-card mb-4">
        <div class="card-body">
          <h2 class="section-title">{{ editingId === null ? 'Crear publicación' : 'Editar publicación' }}</h2>
          <form (ngSubmit)="save()" #postForm="ngForm">
            <input class="form-control mb-3" name="title" [(ngModel)]="title"
              required maxlength="100" placeholder="Título de tu publicación">
            <textarea class="form-control mb-3" name="body" [(ngModel)]="body"
              required rows="3" maxlength="500" placeholder="¿Qué estás pensando?"></textarea>
            <div class="composer-actions">
              @if (editingId !== null) {
                <button type="button" class="btn btn-light" (click)="cancelEdit()">Cancelar</button>
              }
              <button class="btn btn-primary" [disabled]="postForm.invalid || busy">
                {{ editingId === null ? 'Publicar' : 'Guardar cambios' }}
              </button>
            </div>
          </form>
        </div>
      </section>

      @if (loading) { <div class="text-center py-5 text-secondary">Cargando publicaciones...</div> }
      @if (message) { <div class="alert alert-info">{{ message }}</div> }
      @if (!loading && posts.length === 0) { <div class="card p-4 text-center">Todavía no hay publicaciones.</div> }

      <section class="posts-list">
        @for (post of posts; track post.id) {
          <article class="card post-card">
            <div class="card-body">
              <div class="post-top">
                <div class="avatar">{{ initials(post.userId) }}</div>
                <div class="post-author"><strong>Usuario {{ post.userId }}</strong><small>Publicación #{{ post.id }}</small></div>
                <div class="post-menu">
                  <button class="btn btn-sm btn-outline-primary" (click)="edit(post)">Editar</button>
                  <button class="btn btn-sm btn-outline-danger" (click)="remove(post)">Eliminar</button>
                </div>
              </div>
              <h3>{{ post.title }}</h3>
              <p class="post-body">{{ post.body }}</p>
            </div>
          </article>
        }
      </section>
      <p class="api-note">Datos de ejemplo proporcionados por JSONPlaceholder.</p>
    </main>
  </div>`
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  title = '';
  body = '';
  editingId: number | null = null;
  loading = true;
  busy = false;
  message = '';

  constructor(public auth: AuthService, private postsService: PostsService) {}

  ngOnInit(): void { this.loadPosts(); }

  loadPosts(): void {
    this.loading = true;
    this.postsService.getPosts().subscribe({
      next: data => { this.posts = data; this.loading = false; },
      error: () => { this.message = 'No fue posible cargar las publicaciones. Revisa tu conexión.'; this.loading = false; }
    });
  }

  save(): void {
    if (!this.title.trim() || !this.body.trim() || this.busy) return;
    this.busy = true;
    const cleanTitle = this.title.trim();
    const cleanBody = this.body.trim();

    if (this.editingId === null) {
      this.postsService.createPost({ userId: 1, title: cleanTitle, body: cleanBody }).subscribe({
        next: created => {
          // JSONPlaceholder simula el alta; se agrega localmente para verla en pantalla.
          this.posts = [{ ...created, id: created.id || Date.now() }, ...this.posts];
          this.resetForm(); this.message = 'Publicación creada correctamente.'; this.busy = false;
        },
        error: () => { this.message = 'No se pudo crear la publicación.'; this.busy = false; }
      });
    } else {
      const id = this.editingId;
      this.postsService.updatePost(id, { title: cleanTitle, body: cleanBody }).subscribe({
        next: updated => {
          this.posts = this.posts.map(p => p.id === id ? { ...p, ...updated, id } : p);
          this.resetForm(); this.message = 'Publicación actualizada correctamente.'; this.busy = false;
        },
        error: () => { this.message = 'No se pudo actualizar la publicación.'; this.busy = false; }
      });
    }
  }

  edit(post: Post): void {
    this.editingId = post.id; this.title = post.title; this.body = post.body;
    this.message = 'Editando la publicación seleccionada.';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void { this.resetForm(); }

  remove(post: Post): void {
    if (!confirm('¿Seguro que deseas eliminar esta publicación?')) return;
    this.postsService.deletePost(post.id).subscribe({
      next: () => {
        this.posts = this.posts.filter(p => p.id !== post.id);
        if (this.editingId === post.id) this.resetForm();
        this.message = 'Publicación eliminada correctamente.';
      },
      error: () => this.message = 'No se pudo eliminar la publicación.'
    });
  }

  initials(userId: number): string { return `U${userId}`; }

  private resetForm(): void {
    this.title = ''; this.body = ''; this.editingId = null;
  }
}