import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForumStatsComponent } from './forum-stats.component';
import { ForumService } from '../../../core/services/forum.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('ForumStatsComponent', () => {
  let component: ForumStatsComponent;
  let fixture: ComponentFixture<ForumStatsComponent>;
  let forumService: jasmine.SpyObj<ForumService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const forumServiceSpy = jasmine.createSpyObj('ForumService', ['getThreads']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ForumStatsComponent],
      providers: [
        { provide: ForumService, useValue: forumServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    forumService = TestBed.inject(ForumService) as jasmine.SpyObj<ForumService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    const mockThreads = {
      data: [
        { id: '1', title: 'Thread 1', status: 'ACTIVE', postCount: 10 },
        { id: '2', title: 'Thread 2', status: 'ACTIVE', postCount: 5 },
        { id: '3', title: 'Thread 3', status: 'LOCKED', postCount: 20 },
      ],
      total: 3,
    };

    forumService.getThreads.and.returnValue(of(mockThreads as any));

    fixture = TestBed.createComponent(ForumStatsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load forum stats on init', () => {
    fixture.detectChanges();

    expect(forumService.getThreads).toHaveBeenCalledWith({ page: 1, size: 10 });
  });

  it('should calculate stats correctly', () => {
    fixture.detectChanges();

    expect(component.stats.totalThreads).toBe(3);
    expect(component.stats.activeThreads).toBe(2);
    expect(component.stats.totalPosts).toBe(35);
  });

  it('should get top threads sorted by post count', () => {
    fixture.detectChanges();

    expect(component.stats.topThreads.length).toBe(3);
    expect(component.stats.topThreads[0].postCount).toBe(20);
  });

  it('should navigate to thread on click', () => {
    fixture.detectChanges();

    component.navigateToThread('1');

    expect(router.navigate).toHaveBeenCalledWith(['/forum', '1']);
  });

  it('should navigate to forum on view forum', () => {
    fixture.detectChanges();

    component.viewForum();

    expect(router.navigate).toHaveBeenCalledWith(['/forum']);
  });

  it('should calculate post percentage correctly', () => {
    component.stats.totalPosts = 100;

    const percentage = component.getPostPercentage(50);

    expect(percentage).toBe(50);
  });
});
