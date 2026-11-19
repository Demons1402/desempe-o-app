import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly api = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.api);
  }

  createPost(post: Omit<Post, 'id'>): Observable<Post> {
    return this.http.post<Post>(this.api, post);
  }

  updatePost(id: number, post: Pick<Post, 'title' | 'body'>): Observable<Post> {
    return this.http.put<Post>(`${this.api}/${id}`, post);
  }

  deletePost(id: number): Observable<unknown> {
    return this.http.delete(`${this.api}/${id}`);
  }
}