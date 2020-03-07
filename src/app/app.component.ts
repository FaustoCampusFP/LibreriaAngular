import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { environment } from 'src/environments/environment';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  isApp: boolean = false;
  cookieMessage = "Al usar este sitio, acepta nuestra Política de Privacidad y Cookies."
  cookieDismiss = "Aceptar"
  cookieLinkText = "Leer más"
  privacyUrl = "policies"
  opened = true;
  @ViewChild('sidenav') sidenav: MatSidenav;

  ngOnInit() {
    this.isApp = (!document.URL.startsWith('http') || !document.URL.startsWith('http://localhost:8'));
    if(!this.isApp)
    {
      let cc = window as any;
      cc.cookieconsent.initialise({
        palette: {
          popup: {
            background: "#164969"
          },
          button: {
            background: "#ffe000",
            text: "#164969"
          }
        },
        theme: "classic",
        content: {
          message: this.cookieMessage,
          dismiss: this.cookieDismiss,
          link: this.cookieLinkText,
          href: this.privacyUrl
        }
      });
    }

    if (window.innerWidth < 768) {
      this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      this.sidenav.fixedTopGap = 55;
      this.opened = true;
    }

    console.log(this.isApp);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 768) {
      this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      this.sidenav.fixedTopGap = 55
      this.opened = true;
    }
  }

  isBiggerScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width < 768) {
      return true;
    } else {
      return false;
    }
  }

  toggleNavBarIfApp()
  {
    if(this.isApp || (!this.isApp && this.isBiggerScreen()))
      this.sidenav.toggle();
  }

  openNavBarIfApp()
  {
    if(this.isApp)
      this.sidenav.open();
  }

  closeNavBarIfApp()
  {
    if(this.isApp)
      this.sidenav.close();
  }
}