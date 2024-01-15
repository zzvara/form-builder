import { Component } from '@angular/core';
import { VersionControlService } from '../version-control.service';

@Component({
  selector: 'app-version-control',
  templateUrl: './version-control.component.html',
  styleUrls: ['./version-control.component.css']
})
export class VersionControlComponent {
  versions: any[] = [];
  selectedVersion!: number;

  constructor(private versionControlService: VersionControlService) {}

  ngOnInit(): void {
    this.versionControlService.versions$.subscribe((versions) => {
      this.versions = versions;
    });
  }

  revertToVersion(): void {
    if (this.selectedVersion !== undefined) {
      this.versionControlService.revertToVersion(this.selectedVersion);
    }
  }

}
