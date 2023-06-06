import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenubarModule } from 'primeng/menubar';
import { NgxCadacViewerModule } from 'ngx-cadac-viewer';
import { CubePocComponent } from './components/views/cube-poc/cube-poc.component';
import { HomeComponent } from './components/views/home/home.component';
import { NgOptimizedImage } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { ModelsLoadingComponent } from './components/views/models-loading/models-loading.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { SliderModule } from 'primeng/slider';
import { TreeModule } from 'primeng/tree';
import { DividerModule } from 'primeng/divider';
import { DragDropPrimitivesComponent } from './components/views/drag-drop-primitives/drag-drop-primitives.component';
import { DragDropModule } from 'primeng/dragdrop';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { SpeedDialModule } from 'primeng/speeddial';

@NgModule({
  declarations: [
    AppComponent,
    CubePocComponent,
    HomeComponent,
    ModelsLoadingComponent,
    DragDropPrimitivesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MenubarModule,
    NgxCadacViewerModule,
    NgOptimizedImage,
    AvatarModule,
    FormsModule,
    ToggleButtonModule,
    SelectButtonModule,
    ToastModule,
    ColorPickerModule,
    InputSwitchModule,
    InputNumberModule,
    FileUploadModule,
    ImageModule,
    InputTextModule,
    FieldsetModule,
    SliderModule,
    TreeModule,
    DividerModule,
    DragDropModule,
    CardModule,
    InputMaskModule,
    BadgeModule,
    TagModule,
    SpeedDialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
