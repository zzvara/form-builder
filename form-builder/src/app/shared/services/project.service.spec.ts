import { TestBed } from '@angular/core/testing';
import { ProjectService } from './project.service';
import { Project, ProjectType } from '@interfaces/project';

describe('ProjectService', () => {
  let service: ProjectService<Project>;
  let localStorageMock: any;

  // Mock project data
  const mockProject: Project = {
    id: '123',
    title: 'Test Project',
    description: 'A test project',
    type: ProjectType.QUESTIONNAIRE,
    time_checkbox: false,
    deadline_checkbox: false,
    time_limit: 0,
    deadline: '',
    created: '2025-04-14',
    modified: '2025-04-14',
  };

  beforeEach(() => {
    localStorageMock = {
      getItem: jasmine.createSpy('getItem').and.returnValue(null),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem'),
    };

    spyOn(localStorage, 'getItem').and.callFake(localStorageMock.getItem);
    spyOn(localStorage, 'setItem').and.callFake(localStorageMock.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(localStorageMock.removeItem);

    TestBed.configureTestingModule({
      providers: [ProjectService],
    });

    service = TestBed.inject(ProjectService);
  });

  afterEach(() => {
    localStorageMock.getItem.calls.reset();
    localStorageMock.setItem.calls.reset();
    localStorageMock.removeItem.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor', () => {
    it('should initialize with empty items if localStorage is empty', () => {
      expect(localStorage.getItem).toHaveBeenCalledWith('project');
      service.list().subscribe((items) => {
        expect(items).toEqual([]);
      });
    });

    it('should load items from localStorage if available', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [ProjectService],
      });

      const storedProjects = [mockProject];

      const newLocalStorageMock = {
        getItem: (key: string) => {
          return key === 'project' ? JSON.stringify(storedProjects) : null;
        },
        setItem: jasmine.createSpy('setItem'),
        removeItem: jasmine.createSpy('removeItem'),
      };

      localStorage.getItem = jasmine.createSpy().and.callFake(newLocalStorageMock.getItem);

      const newService = TestBed.inject(ProjectService);

      newService.list().subscribe((items) => {
        expect(items.length).toBe(1);
        expect(items[0]).toEqual(mockProject);
      });
    });
  });

  describe('list', () => {
    it('should return an observable of items', () => {
      const result = service.list();
      expect(result).toBeDefined();
      result.subscribe((items) => {
        expect(Array.isArray(items)).toBe(true);
      });
    });
  });

  describe('add', () => {
    it('should add a project to the list', () => {
      const newProject = { ...mockProject };

      service.add(newProject as Project);

      service.list().subscribe((items) => {
        expect(items.length).toBe(1);
        expect(items[0].title).toBe('Test Project');
        expect(items[0].id).toBeDefined();
      });

      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a project from the list', () => {
      service.add(mockProject);

      service.remove(mockProject.id);

      service.list().subscribe((items) => {
        expect(items.length).toBe(0);
      });

      expect(localStorage.setItem).toHaveBeenCalled();
      expect(localStorage.removeItem).toHaveBeenCalledWith(`project-history-${mockProject.id}`);
    });
  });

  describe('getProjectHistory', () => {
    it('should return project history from localStorage', () => {
      const mockHistory = [{ versionNum: 1, project: mockProject }];
      localStorageMock.getItem.and.returnValue(JSON.stringify(mockHistory));

      const history = service.getProjectHistory('123');

      expect(history).toEqual(mockHistory);
      expect(localStorage.getItem).toHaveBeenCalledWith('project-history-123');
    });

    it('should return empty array if no history exists', () => {
      localStorageMock.getItem.and.returnValue(null);

      const history = service.getProjectHistory('123');

      expect(history).toEqual([]);
    });
  });

  describe('getProjectVersion', () => {
    it('should return specific version of project', () => {
      const mockHistory = [
        { versionNum: 1, project: { ...mockProject, title: 'Version 1' } },
        { versionNum: 2, project: { ...mockProject, title: 'Version 2' } },
      ];

      spyOn(service, 'getProjectHistory').and.returnValue(mockHistory);

      const version = service.getProjectVersion('123', 2);

      expect(version).toEqual(mockHistory[1].project);
      expect(service.getProjectHistory).toHaveBeenCalledWith('123');
    });

    it('should return undefined if version not found', () => {
      spyOn(service, 'getProjectHistory').and.returnValue([]);

      const version = service.getProjectVersion('123', 1);

      expect(version).toBeUndefined();
    });
  });

  describe('revertToVersion', () => {
    it('should revert project to specified version', () => {
      const projectToAdd = { ...mockProject };
      service.add(projectToAdd);

      let projectId: string | undefined;
      service.list().subscribe((items) => {
        if (items.length > 0) {
          projectId = items[0].id;
        }
      });

      if (!projectId) {
        throw new Error('Project ID is undefined. Ensure a project is added before proceeding.');
      }

      const mockVersion = {
        ...mockProject,
        title: 'Old Version',
        id: projectId,
      };
      const mockHistory = [{ versionNum: 1, project: mockVersion }];

      const historyKey = `project-history-${projectId}`;
      localStorageMock.getItem.and.callFake((key: string) => {
        if (key === historyKey) {
          return JSON.stringify(mockHistory);
        }
        return null;
      });

      const result = service.revertToVersion(projectId, 1);

      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalled();

      service.list().subscribe((items) => {
        expect(items[0].title).toBe('Old Version');
      });
    });

    it('should return false if version not found', () => {
      localStorageMock.getItem.and.returnValue('[]');

      const result = service.revertToVersion('123', 1);

      expect(result).toBe(false);
    });

    it('should return false if project not found', () => {
      const mockHistory = [{ versionNum: 1, project: mockProject }];
      localStorageMock.getItem.and.returnValue(JSON.stringify(mockHistory));

      const result = service.revertToVersion('nonexistent', 1);

      expect(result).toBe(false);
    });
  });

  describe('update', () => {
    it('should update an existing project', () => {
      service.add(mockProject);

      localStorageMock.getItem.and.returnValue('[]');

      const updatedProject = { ...mockProject, title: 'Updated Project' };
      const result = service.update(mockProject.id, updatedProject);

      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalled();

      service.list().subscribe((items) => {
        expect(items[0].title).toBe('Updated Project');
      });
    });

    it('should not update if project not found', () => {
      const result = service.update('nonexistent', mockProject);

      expect(result).toBe(false);
    });

    it('should not update if new data is identical to latest version', () => {
      service.add(mockProject);

      const mockHistory = [{ versionNum: 1, project: mockProject }];
      localStorageMock.getItem.and.returnValue(JSON.stringify(mockHistory));

      const result = service.update(mockProject.id, mockProject);

      expect(result).toBe(false);
    });
  });

  describe('searchData', () => {
    it('should find projects by id', () => {
      service.add(mockProject);

      const foundProjects = service.searchData(mockProject.id);

      expect(foundProjects.length).toBe(1);
      expect(foundProjects[0].id).toBe(mockProject.id);
    });

    it('should return empty array if no projects match', () => {
      const foundProjects = service.searchData('nonexistent');

      expect(foundProjects).toEqual([]);
    });
  });
});
