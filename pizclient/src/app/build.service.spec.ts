import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BuildService } from './build.service';

describe('BuildService', () => {
  let service: BuildService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(BuildService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
