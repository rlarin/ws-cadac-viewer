import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CubePocComponent } from './components/views/cube-poc/cube-poc.component';
import { HomeComponent } from './components/views/home/home.component';
import { ModelsLoadingComponent } from './components/views/models-loading/models-loading.component';
import { DragDropPrimitivesComponent } from './components/views/drag-drop-primitives/drag-drop-primitives.component';

const routes: Routes = [
  {
    path: 'cube-poc',
    component: CubePocComponent,
  },
  {
    path: 'models-loading',
    component: ModelsLoadingComponent,
  },
  {
    path: 'drag-drop-primitives',
    component: DragDropPrimitivesComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
