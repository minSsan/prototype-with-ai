// Sample data for the prototype
const sampleBooks = [
  {
    id: 1,
    title: "클린 아키텍처",
    author: "로버트 C. 마틴",
    description: "소프트웨어 구조와 설계의 원칙을 다루는 책으로, 좋은 아키텍처란 무엇이며 어떻게 달성할 수 있는지 설명합니다.",
    price: 28000,
    condition: "거의 새책",
    category: "architecture",
    image: "https://image.yes24.com/goods/77283734/XL",
    seller: "김민선"
  },
  {
    id: 2,
    title: "리팩토링 2판",
    author: "마틴 파울러",
    description: "코드 구조를 체계적으로 개선하여 효율적이고 버그 없는 코드로 만드는 기법을 제시합니다.",
    price: 33000,
    condition: "양호",
    category: "architecture",
    image: "https://image.yes24.com/goods/89649360/XL",
    seller: "김영희"
  },
  {
    id: 3,
    title: "모던 JavaScript 튜토리얼",
    author: "일리야 칸토르",
    description: "최신 JavaScript 문법과 기능들을 실무 중심으로 설명하는 프론트엔드 개발자 필수 도서입니다.",
    price: 25000,
    condition: "새책",
    category: "frontend",
    image: "https://image.yes24.com/goods/92742567/XL",
    seller: "김철수"
  },
  {
    id: 4,
    title: "스프링 부트와 AWS로 혼자 구현하는 웹 서비스",
    author: "이동욱",
    description: "스프링 부트를 활용한 웹 서비스 개발부터 AWS 배포까지 전 과정을 다루는 실습서입니다.",
    price: 24000,
    condition: "보통",
    category: "backend",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGMPGrIZYcGlwWgh-KGMVLPxYjiKsXbyxSuA&s",
    seller: "김민수"
  },
  {
    id: 5,
    title: "알고리즘 문제 해결 전략",
    author: "구종만",
    description: "프로그래밍 대회와 코딩 테스트를 위한 알고리즘 문제 해결 기법을 체계적으로 정리한 책입니다.",
    price: 35000,
    condition: "거의 새책",
    category: "algorithm",
    image: "https://book.algospot.com/static/img/cover1-small.png",
    seller: "김영희"
  }
];

const samplePosts = [
  {
    id: 1,
    bookId: 1,
    title: "의존성 역전 원칙이 실제 프로젝트에서 어떻게 적용될까요?",
    content: "클린 아키텍처를 읽으면서 의존성 역전 원칙(DIP)에 대해 공부하고 있는데, 실제 프로젝트에서 어떻게 적용하는지 궁금합니다. 구체적인 예시가 있다면 공유해주세요!",
    author: "김철수",
    authorRole: "student",
    date: "2024-01-15",
    likes: 12,
    comments: 8
  },
  {
    id: 2,
    bookId: 1,
    title: "아키텍처 설계 시 고려사항들",
    content: "15년차 개발자로서 다양한 프로젝트의 아키텍처를 설계해왔습니다. 클린 아키텍처에서 제시하는 원칙들을 실무에 적용할 때 주의할 점들을 공유하고 싶습니다.",
    author: "김영희",
    authorRole: "senior",
    date: "2024-01-14",
    likes: 25,
    comments: 15
  },
  {
    id: 3,
    bookId: 2,
    title: "리팩토링할 때 테스트 코드 작성 순서",
    content: "리팩토링 2판을 읽고 있는데, 기존 코드를 리팩토링할 때 테스트 코드를 먼저 작성해야 하는지, 리팩토링 후에 작성해야 하는지 헷갈립니다. 경험 있으신 분들의 조언 부탁드려요.",
    author: "김민수",
    authorRole: "junior",
    date: "2024-01-13",
    likes: 8,
    comments: 12
  }
];

// Initialize localStorage with sample data if empty
function initializeData() {
  if (!localStorage.getItem('devbooks_books')) {
    localStorage.setItem('devbooks_books', JSON.stringify(sampleBooks));
  }
  
  if (!localStorage.getItem('devbooks_posts')) {
    localStorage.setItem('devbooks_posts', JSON.stringify(samplePosts));
  }
  
  if (!localStorage.getItem('devbooks_users')) {
    const sampleUsers = [
      { id: 1, name: "김철수", email: "student@example.com", password: "123456", role: "student", purchases: [1, 3] },
      { id: 2, name: "김민수", email: "junior@example.com", password: "123456", role: "junior", purchases: [2, 4] },
      { id: 3, name: "김영희", email: "senior@example.com", password: "123456", role: "senior", purchases: [1, 2, 5] },
      { id: 4, name: "김민선", email: "seller@example.com", password: "123456", role: "other", purchases: [] }
    ];
    localStorage.setItem('devbooks_users', JSON.stringify(sampleUsers));
  }
}

// Data access functions
function getBooks() {
  return JSON.parse(localStorage.getItem('devbooks_books') || '[]');
}

function saveBooks(books) {
  localStorage.setItem('devbooks_books', JSON.stringify(books));
}

function getBook(id) {
  const books = getBooks();
  return books.find(book => book.id === parseInt(id));
}

function addBook(book) {
  const books = getBooks();
  book.id = Math.max(...books.map(b => b.id), 0) + 1;
  books.push(book);
  saveBooks(books);
  return book;
}

function getPosts(bookId) {
  const posts = JSON.parse(localStorage.getItem('devbooks_posts') || '[]');
  return bookId ? posts.filter(post => post.bookId === parseInt(bookId)) : posts;
}

function savePosts(posts) {
  localStorage.setItem('devbooks_posts', JSON.stringify(posts));
}

function addPost(post) {
  const posts = getPosts();
  post.id = Math.max(...posts.map(p => p.id), 0) + 1;
  post.date = new Date().toISOString().split('T')[0];
  post.likes = 0;
  post.comments = 0;
  posts.push(post);
  savePosts(posts);
  return post;
}

function getUsers() {
  return JSON.parse(localStorage.getItem('devbooks_users') || '[]');
}

function saveUsers(users) {
  localStorage.setItem('devbooks_users', JSON.stringify(users));
}

function findUser(email, password) {
  const users = getUsers();
  return users.find(user => user.email === email && user.password === password);
}

function addUser(user) {
  const users = getUsers();
  user.id = Math.max(...users.map(u => u.id), 0) + 1;
  user.purchases = [];
  users.push(user);
  saveUsers(users);
  return user;
}

function addPurchase(userId, bookId) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (user && !user.purchases.includes(bookId)) {
    user.purchases.push(bookId);
    saveUsers(users);
  }
}

function hasPurchased(userId, bookId) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  return user ? user.purchases.includes(bookId) : false;
}

// Initialize data on load
initializeData();