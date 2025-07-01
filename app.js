// Main application logic
class DevBooksApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeUI();
    this.setupTheme();
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.dataset.page;
        if (page === 'home') {
          ui.showPage('homePage');
        } else if (page === 'sell') {
          if (!auth.isLoggedIn()) {
            ui.showModal('loginModal');
            return;
          }
          ui.showPage('sellPage');
        }
      });
    });

    // Auth buttons
    document.getElementById('loginBtn').addEventListener('click', () => {
      ui.showModal('loginModal');
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
      auth.logout();
      ui.updateAuthUI();
      ui.showPage('homePage');
      ui.showNotification('로그아웃되었습니다.');
    });

    // Modal controls
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        modal.classList.remove('active');
      });
    });

    // Close modal on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });

    // Auth form switches
    document.getElementById('showSignup').addEventListener('click', (e) => {
      e.preventDefault();
      ui.hideModal('loginModal');
      ui.showModal('signupModal');
    });

    document.getElementById('showLogin').addEventListener('click', (e) => {
      e.preventDefault();
      ui.hideModal('signupModal');
      ui.showModal('loginModal');
    });

    // Login form
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      const result = auth.login(email, password);
      if (result.success) {
        ui.hideModal('loginModal');
        ui.updateAuthUI();
        ui.showNotification('로그인되었습니다.');
        document.getElementById('loginForm').reset();
      } else {
        ui.showNotification(result.message);
      }
    });

    // Signup form
    document.getElementById('signupForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const userData = {
        name: document.getElementById('signupName').value,
        email: document.getElementById('signupEmail').value,
        password: document.getElementById('signupPassword').value,
        role: document.getElementById('signupRole').value
      };
      
      const result = auth.signup(userData);
      if (result.success) {
        ui.hideModal('signupModal');
        ui.updateAuthUI();
        ui.showNotification('회원가입이 완료되었습니다.');
        document.getElementById('signupForm').reset();
      } else {
        ui.showNotification(result.message);
      }
    });

    // Book purchase
    document.getElementById('purchaseBtn').addEventListener('click', () => {
      if (!auth.isLoggedIn()) {
        ui.showModal('loginModal');
        return;
      }

      if (ui.currentBook) {
        const success = auth.purchaseBook(ui.currentBook.id);
        if (success) {
          ui.showNotification('구매가 완료되었습니다!');
          ui.showBookDetail(ui.currentBook.id); // Refresh the page
        }
      }
    });

    // Discussion access
    document.getElementById('discussionBtn').addEventListener('click', () => {
      if (ui.currentBook) {
        ui.showDiscussion(ui.currentBook.id);
      }
    });

    // New post
    document.getElementById('newPostBtn').addEventListener('click', () => {
      if (!auth.isLoggedIn()) {
        ui.showModal('loginModal');
        return;
      }
      ui.showModal('newPostModal');
    });

    // New post form
    document.getElementById('newPostForm').addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!ui.currentBook) return;
      
      const user = auth.getCurrentUser();
      const postData = {
        bookId: ui.currentBook.id,
        title: document.getElementById('postTitle').value,
        content: document.getElementById('postContent').value,
        author: user.name,
        authorRole: user.role
      };
      
      addPost(postData);
      ui.hideModal('newPostModal');
      ui.renderPosts(ui.currentBook.id);
      ui.showNotification('게시글이 등록되었습니다.');
      document.getElementById('newPostForm').reset();
    });

    // Sell form
    document.getElementById('sellForm').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const user = auth.getCurrentUser();
      const bookData = {
        title: document.getElementById('sellTitle').value,
        author: document.getElementById('sellAuthor').value,
        category: document.getElementById('sellCategory').value,
        description: document.getElementById('sellDescription').value,
        price: parseInt(document.getElementById('sellPrice').value),
        condition: document.getElementById('sellCondition').value,
        image: document.getElementById('sellImage').value || 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
        seller: user.name
      };
      
      addBook(bookData);
      ui.showNotification('서적이 등록되었습니다.');
      document.getElementById('sellForm').reset();
      ui.showPage('homePage');
      ui.renderBooks(); // Refresh books list
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        ui.setFilter(filter);
      });
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  initializeUI() {
    ui.updateAuthUI();
    ui.renderBooks();
  }

  setupTheme() {
    // Load saved theme
    const savedTheme = localStorage.getItem('devbooks_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeToggle(savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('devbooks_theme', newTheme);
    this.updateThemeToggle(newTheme);
  }

  updateThemeToggle(theme) {
    const toggle = document.getElementById('themeToggle');
    toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DevBooksApp();
});