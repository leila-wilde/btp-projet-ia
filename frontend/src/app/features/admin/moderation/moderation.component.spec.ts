import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModerationComponent } from './moderation.component';
import { ForumService } from '../../../core/services/forum.service';
import { of } from 'rxjs';

describe('ModerationComponent', () => {
  let component: ModerationComponent;
  let fixture: ComponentFixture<ModerationComponent>;
  let forumService: jasmine.SpyObj<ForumService>;

  beforeEach(async () => {
    const forumServiceSpy = jasmine.createSpyObj('ForumService', ['getAllThreads']);

    await TestBed.configureTestingModule({
      imports: [ModerationComponent],
      providers: [{ provide: ForumService, useValue: forumServiceSpy }],
    }).compileComponents();

    forumService = TestBed.inject(ForumService) as jasmine.SpyObj<ForumService>;

    forumService.getAllThreads.and.returnValue(of({ data: [], total: 0, page: 0, pageSize: 10, hasMore: false }));

    fixture = TestBed.createComponent(ModerationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load flagged content on init', () => {
    fixture.detectChanges();

    expect(forumService.getAllThreads).toHaveBeenCalled();
  });

  it('should calculate stats correctly', () => {
    component.flaggedContent = [
      {
        id: '1',
        type: 'THREAD',
        content: 'Test',
        author: 'user1',
        reportCount: 2,
        reason: 'Spam',
        status: 'PENDING',
        createdAt: new Date(),
      },
      {
        id: '2',
        type: 'POST',
        content: 'Test 2',
        author: 'user2',
        reportCount: 1,
        reason: 'Offensive',
        status: 'RESOLVED',
        createdAt: new Date(),
      },
    ];

    component['calculateStats']();

    expect(component.stats.totalFlagged).toBe(2);
    expect(component.stats.pendingReview).toBe(1);
    expect(component.stats.resolved).toBe(1);
  });

  it('should return correct status color', () => {
    expect(component.getStatusColor('PENDING')).toBe('warn');
    expect(component.getStatusColor('REVIEWED')).toBe('accent');
    expect(component.getStatusColor('RESOLVED')).toBe('primary');
  });

  it('should return correct type color', () => {
    expect(component.getTypeColor('THREAD')).toBe('primary');
    expect(component.getTypeColor('POST')).toBe('accent');
    expect(component.getTypeColor('COMMENT')).toBe('disabled');
  });
});
