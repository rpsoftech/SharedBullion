import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavBar3Component } from '@rps/angular-nav-bars';

interface navigationBar {
  // uid: string;
  router_link: string;
}

interface navbar3 extends navigationBar {
  uid: string;
  icon: {
    url: string;
    inactive_color: string;
    active_color: string;
  };
  name: string;
  indicator_color: string;
}
@Component({
  selector: 'shiv-bull-app-footer',
  standalone: true,
  imports: [CommonModule, NgFor, NavBar3Component, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  navbar: navbar3[] = [
    {
      uid: '1',
      router_link: 'home/about',

      icon: {
        url: '../../assets/images/newspaper-outline.svg',
        inactive_color: 'var(--header-bg)',
        active_color: 'white',
      },
      name: 'News',
      indicator_color: '#543e12',
    },
    {
      uid: '2',
      router_link: 'home/about',

      icon: {
        url: '../../assets/images/icon_bank_detail.svg',
        inactive_color: 'var(--header-bg)',
        active_color: 'white',
      },
      name: 'Bank-Details',
      indicator_color: '#543e12',
    },
    {
      uid: '3',
      router_link: 'home/about',

      icon: {
        url: '../../assets/images/nav_Lagdi_logo.svg',
        inactive_color: 'var(--header-bg)',
        active_color: 'white',
      },
      name: 'Live-Rate',
      indicator_color: '#543e12',
    },
    {
      uid: '4',
      router_link: 'home/ab',

      icon: {
        url: '../../assets/images/nav_contact_logo.svg',
        inactive_color: 'var(--header-bg',
        active_color: 'white',
      },
      name: 'Contact-us',
      indicator_color: '#543e12',
    },
    {
      uid: '5',
      router_link: 'home/live-rate',

      icon: {
        url: '../../assets/images/calendar-outline.svg',
        inactive_color: 'var(--header-bg',
        active_color: 'white',
      },
      name: 'Eco.Calander',
      indicator_color: '#543e12',
    },
  ];
  active_uid = '4';
  constructor(private routes: Router) {}

  OnChnageEvent(vlueEitted: string) {
    console.log(vlueEitted);
    this.active_uid = vlueEitted;
    const found = this.navbar.find(({ uid }) => uid === this.active_uid);
    if (found) {
      this.routes.navigateByUrl(`${found?.router_link}`);
      console.log(found?.router_link);
    }
  }
}
