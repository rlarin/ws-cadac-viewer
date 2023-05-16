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

@NgModule({
  declarations: [AppComponent, CubePocComponent, HomeComponent],
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
