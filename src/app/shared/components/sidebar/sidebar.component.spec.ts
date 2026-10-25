import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { inputFixture } from '@app/testing/fixtures';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters case-insensitively, hides empty groups, and restores them when cleared', () => {
    const groups = [
      {
        groupName: 'Text',
        active: true,
        dropListConnectedTo: () => [],
        groupContents: [inputFixture('text', { title: 'Text input' })],
      },
      {
        groupName: 'Dates',
        active: true,
        dropListConnectedTo: () => [],
        groupContents: [inputFixture('date', { title: 'Date picker' })],
      },
    ];
    component.sidebarData = groups;
    expect(component.sidebarData).toBe(groups);
    component.searchTerm.set('TEXT');
    component.filterItems();
    expect(component.filteredData()).toEqual([groups[0]]);
    expect(groups).toHaveSize(2);
    component.searchTerm.set('missing');
    component.filterItems();
    expect(component.filteredData()).toEqual([]);
    component.clearSearch();
    expect(component.searchTerm()).toBe('');
    expect(component.filteredData()).toEqual(groups);
  });
});
