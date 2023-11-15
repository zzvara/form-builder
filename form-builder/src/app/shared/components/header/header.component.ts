import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuOption } from '../../models/menu-option.model';
import { HeaderService } from '../../../services/header/header.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  headerOptions: MenuOption[] = [];
  options = MenuOption;
  optionsSub?: Subscription;

  constructor(
    private readonly router: Router,
    private readonly headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.optionsSub = this.headerService
      .getOptions()
      .subscribe((options) => (this.headerOptions = options));
  }

  navigateToHome(): void {
    this.router.navigate(['dashboard']);
  }

  ngOnDestroy(): void {
    this.optionsSub?.unsubscribe();
  }
}
