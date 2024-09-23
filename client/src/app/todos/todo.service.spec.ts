import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Todo } from './todo';

describe('TodoService', () => {
  const testTodos: Todo[] = [
    {
      _id: '58895985a22c04e761776d54',
      owner: 'Blanche',
      status: false,
      body: 'In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.',
      category: 'software design',
    },
    {
      _id: '58895985c1849992336c219b',
      owner: 'Fry',
      status: false,
      body: 'Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.',
      category: 'video games',
    },
    {
      _id: '5889598528c4748a0292e014',
      owner: 'Workman',
      status: true,
      body: 'Eiusmod commodo officia amet aliquip est ipsum nostrud duis sunt voluptate mollit excepteur. Sunt non in pariatur et culpa est sunt.',
      category: 'software design',
    },
  ];
  let todoService: TodoService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    todoService = new TodoService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('getTodos()', () => {
    it('calls api/todos when getTodos() is called with no parameters', () => {
      todoService.getTodos().subscribe(todos => expect(todos).toBe(testTodos));
      const req = httpTestingController.expectOne(todoService.todoUrl);
      expect(req.request.method).toEqual('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush(testTodos);
    });

    it("correctly calls api/todos with filter parameter 'body'", () => {
      todoService.getTodos({ body: 'esse' }).subscribe(todos => expect(todos).toBe(testTodos));

      // Specify that (exactly) one request will be made to the specified URL with the age parameter.
      const req = httpTestingController.expectOne(
        request => request.url.startsWith(todoService.todoUrl) && request.params.has('body')
      );

      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');

      // Check that the age parameter was '25'
      expect(req.request.params.get('body')).toEqual('esse');

      req.flush(testTodos);
    });

    describe('calling getTodos() with parameters correctly forms the HTTP Request', () => {
      it('correctly calls api/todos with multiple filter parameters', () => {
        todoService.getTodos({ owner: 'Fry', status: true }).subscribe(todos => expect(todos).toBe(testTodos));

        // Specify that (exactly) one request will be made to the specified URL with the role parameter.
        const req = httpTestingController.expectOne(
          request =>
            request.url.startsWith(todoService.todoUrl) && request.params.has('owner') && request.params.has('status')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the role, company, and age parameters are correct
        expect(req.request.params.get('owner')).toEqual('Fry');
        expect(req.request.params.get('status')).toEqual('true');

        req.flush(testTodos);
      });
    });
  });

  //If want to implement to view more uncoment
  /*
  describe('getTodoByID()', () => {
    it('calls api/todos/id with the correct ID', () => {
      // We're just picking a User "at random" from our little
      // set of Users up at the top.
      const targetTodo: Todo = testTodos[1];
      const targetId: string = targetTodo._id;

      todoService.getTodoById(targetId).subscribe(
        // This `expect` doesn't do a _whole_ lot.
        // Since the `targetUser`
        // is what the mock `HttpClient` returns in the
        // `req.flush(targetUser)` line below, this
        // really just confirms that `getUserById()`
        // doesn't in some way modify the user it
        // gets back from the server.
        todo => expect(todo).toBe(targetTodo)
      );

      const expectedUrl: string = todoService.todoUrl + '/' + targetId;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(targetTodo);
    });
  });
  */

  describe('filterTodos()', () => {
    it('filters by category', () => {
      const todoCategory = 'video games';
      const filteredTodos = todoService.filterTodos(testTodos, { category: todoCategory });
      // There should be just one todo that has video games as their category.
      expect(filteredTodos.length).toBe(1);
      // Every returned todo's category should contain 'video games'.
      filteredTodos.forEach(todo => {
        expect(todo.category.indexOf(todoCategory)).toBeGreaterThanOrEqual(0);
      });
    });
    it('filters with limit',  () => {
      const todoLimit=1;
      const filteredTodos = todoService.filterTodos(testTodos, { limit: todoLimit});
      expect(filteredTodos.length).toBe(todoLimit);
    })

    it('filters by owner and category', () => {
      // There's only one owner (Fry) whose owner
      // contains an 'y' and whose company contains
      // an 'v'. There are two whose owner contains
      // an 'n' and two whose category contains an
      // an 's', so this should test combined filtering.
      const todoOwner = 'y';
      const todoCategory = 'v';
      const filters = { owner: todoOwner, category: todoCategory };
      const filteredTodos = todoService.filterTodos(testTodos, filters);
      // There should be just one user with these properties.
      expect(filteredTodos.length).toBe(1);
      // Every returned user should have _both_ these properties.
      filteredTodos.forEach(todo => {
        expect(todo.owner.indexOf(todoOwner)).toBeGreaterThanOrEqual(0);
        expect(todo.category.indexOf(todoCategory)).toBeGreaterThanOrEqual(0);
      });
    });


    it('filters by body', () => {
      const todoBody = 'esse';
      const filters = { body: todoBody };
      const filteredTodos = todoService.filterTodos(testTodos, filters);

      expect(filteredTodos.length).toBe(2);

      filteredTodos.forEach(todo => {
        expect(todo.body.indexOf(todoBody)).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
