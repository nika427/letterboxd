import { Routes } from '@angular/router';
import { MoviesComponent } from './pages/movies/movies.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { ActorsComponent } from './pages/actors/actors.component';
import { ActorDetailsComponent } from './pages/actor-details/actor-details.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FollowersComponent } from './pages/followers/followers.component';
import { UsersComponent } from './pages/users/users.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { VerifyComponent } from './pages/auth/verify/verify.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'films', pathMatch: 'full' },
  { path: 'films', component: MoviesComponent },
  { path: 'film/:id', component: MovieDetailsComponent },
  { path: 'actors', component: ActorsComponent },
  { path: 'actor/:id', component: ActorDetailsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user/:id', component: ProfileComponent },
  { path: 'users', component: UsersComponent },
  { path: 'followers/:id', component: FollowersComponent },
  { path: 'following/:id', component: FollowersComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: '**', redirectTo: 'films' }
];