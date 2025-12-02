import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ThreadCreateComponent } from './thread-create.component';
import { ForumService } from '../../../core/services/forum.service';
import { ForumThread, CreateThreadRequest } from '../../../models/forum.model';

describe('ThreadCreateComponent', () => {
  let component: ThreadCreateComponent;
  let fixture: ComponentFixture<ThreadCreateComponent>;
  let forumService: jasmine.SpyObj<ForumService>;
  let router: jasmine.SpyObj<Router>;

  const mockThread: ForumThread = {
    id: '1',
    title: 'New Thread',
    content: 'This is a new thread content',
    category: 'general',
    pinned: false,
    locked: false,
    creator: { id: 'user1', username: 'testuser' },
    postCount: 0,
    createdAt: new Date(),
    lastActivityAt: new Date()
  };

  beforeEach(async () => {
    const forumServiceSpy = jasmine.createSpyObj('ForumService', ['createThread']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ThreadCreateComponent, ReactiveFormsModule],
      providers: [
        { provide: ForumService, useValue: forumServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    forumService = TestBed.inject(ForumService) as jasmine.SpyObj<ForumService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    forumService.createThread.and.returnValue(of(mockThread));

    fixture = TestBed.createComponent(ThreadCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    const titleControl = component.createForm.get('title');
    const contentControl = component.createForm.get('content');
    const categoryControl = component.createForm.get('category');

    expect(titleControl?.value).toBe('');
    expect(contentControl?.value).toBe('');
    expect(categoryControl?.value).toBe('general');
  });

  it('should validate title field', () => {
    const titleControl = component.createForm.get('title');

    titleControl?.setValue('');
    expect(titleControl?.hasError('required')).toBe(true);

    titleControl?.setValue('abc');
    expect(titleControl?.hasError('minlength')).toBe(true);

    titleControl?.setValue('a'.repeat(201));
    expect(titleControl?.hasError('maxlength')).toBe(true);

    titleControl?.setValue('Valid Thread Title');
    expect(titleControl?.valid).toBe(true);
  });

  it('should validate content field', () => {
    const contentControl = component.createForm.get('content');

    contentControl?.setValue('');
    expect(contentControl?.hasError('required')).toBe(true);

    contentControl?.setValue('short');
    expect(contentControl?.hasError('minlength')).toBe(true);

    contentControl?.setValue('a'.repeat(5001));
    expect(contentControl?.hasError('maxlength')).toBe(true);

    contentControl?.setValue('This is a valid thread content with sufficient length');
    expect(contentControl?.valid).toBe(true);
  });

  it('should validate category field', () => {
    const categoryControl = component.createForm.get('category');

    categoryControl?.setValue('');
    expect(categoryControl?.hasError('required')).toBe(true);

    categoryControl?.setValue('general');
    expect(categoryControl?.valid).toBe(true);
  });

  it('should submit valid form', () => {
    component.createForm.patchValue({
      title: 'Test Thread Title',
      content: 'This is a test thread content that is long enough',
      category: 'general'
    });

    component.submitForm();

    expect(forumService.createThread).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Test Thread Title',
        content: 'This is a test thread content that is long enough',
        category: 'general'
      })
    );
  });

  it('should not submit invalid form', () => {
    component.createForm.patchValue({
      title: 'ab',
      content: 'short',
      category: ''
    });

    component.submitForm();

    expect(forumService.createThread).not.toHaveBeenCalled();
  });

  it('should navigate to thread after successful creation', (done) => {
    component.createForm.patchValue({
      title: 'Test Thread Title',
      content: 'This is a test thread content that is long enough',
      category: 'general'
    });

    component.submitForm();

    setTimeout(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/forum/threads', '1']);
      done();
    }, 100);
  });

  it('should handle creation error', (done) => {
    forumService.createThread.and.returnValue(
      new Observable(observer => {
        observer.error({ error: { message: 'Server error' } });
      })
    );

    component.createForm.patchValue({
      title: 'Test Thread Title',
      content: 'This is a test thread content that is long enough',
      category: 'general'
    });

    component.submitForm();

    setTimeout(() => {
      expect(component.error).toBeTruthy();
      expect(component.submitting).toBe(false);
      done();
    }, 100);
  });

  it('should cancel and navigate back', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/forum']);
  });

  it('should return category label', () => {
    expect(component.getCategoryLabel('general')).toBe('General Discussion');
    expect(component.getCategoryLabel('projects')).toBe('Projects & Ideas');
    expect(component.getCategoryLabel('unknown')).toBe('unknown');
  });

  it('should count characters', () => {
    component.createForm.patchValue({
      title: 'Hello World',
      content: 'This is a test'
    });

    expect(component.getCharacterCount('title')).toBe(11);
    expect(component.getCharacterCount('content')).toBe(14);
  });

  it('should return character limits', () => {
    expect(component.getCharacterLimit('title')).toBe(200);
    expect(component.getCharacterLimit('content')).toBe(5000);
    expect(component.getCharacterLimit('unknown')).toBe(0);
  });

  it('should disable submit button when form is invalid', () => {
    component.createForm.patchValue({
      title: 'ab',
      content: 'short',
      category: ''
    });

    expect(component.createForm.valid).toBe(false);
  });

  it('should display all categories', () => {
    expect(component.categories.length).toBe(5);
    expect(component.categories.map(c => c.value)).toContain('general');
    expect(component.categories.map(c => c.value)).toContain('projects');
    expect(component.categories.map(c => c.value)).toContain('help');
    expect(component.categories.map(c => c.value)).toContain('announcements');
    expect(component.categories.map(c => c.value)).toContain('events');
  });
});

import { Observable } from 'rxjs';
