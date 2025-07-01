// UI utility functions
class UIManager {
  constructor() {
    this.currentPage = 'home';
    this.currentBook = null;
    this.currentFilter = 'all';
  }

  showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
      this.currentPage = pageId;
    }
  }

  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
    }
  }

  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  }

  updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');

    if (auth.isLoggedIn()) {
      const user = auth.getCurrentUser();
      loginBtn.classList.add('hidden');
      userProfile.classList.remove('hidden');
      userName.textContent = user.name;
    } else {
      loginBtn.classList.remove('hidden');
      userProfile.classList.add('hidden');
    }
  }

  renderBooks(books = null) {
    if (!books) {
      books = getBooks();
    }

    // Apply filter
    if (this.currentFilter !== 'all') {
      books = books.filter(book => book.category === this.currentFilter);
    }

    const grid = document.getElementById('booksGrid');
    if (!grid) return;

    grid.innerHTML = books.map(book => `
      <div class="book-card" data-book-id="${book.id}">
        <div class="category-tag">${this.getCategoryLabel(book.category)}</div>
        <img src="${book.image}" alt="${book.title}" class="book-cover">
        <h4>${book.title}</h4>
        <p class="author">저자: ${book.author}</p>
        <p class="description">${book.description}</p>
        <div class="book-meta-info">
          <span class="price">${book.price.toLocaleString()}원</span>
          <span class="condition">${book.condition}</span>
        </div>
      </div>
    `).join('');

    // Add click handlers
    grid.querySelectorAll('.book-card').forEach(card => {
      card.addEventListener('click', () => {
        const bookId = card.dataset.bookId;
        this.showBookDetail(bookId);
      });
    });
  }

  showBookDetail(bookId) {
    const book = getBook(bookId);
    if (!book) return;

    this.currentBook = book;
    
    // Update book detail page
    document.getElementById('bookImage').src = book.image;
    document.getElementById('bookImage').alt = book.title;
    document.getElementById('bookTitle').textContent = book.title;
    document.getElementById('bookAuthor').textContent = `저자: ${book.author}`;
    document.getElementById('bookDescription').textContent = book.description;
    document.getElementById('bookPrice').textContent = `${book.price.toLocaleString()}원`;
    document.getElementById('bookCondition').textContent = book.condition;

    // Update buttons based on auth status
    const purchaseBtn = document.getElementById('purchaseBtn');
    const discussionBtn = document.getElementById('discussionBtn');

    if (auth.isLoggedIn()) {
      const user = auth.getCurrentUser();
      if (hasPurchased(user.id, parseInt(bookId))) {
        purchaseBtn.style.display = 'none';
        discussionBtn.classList.remove('hidden');
      } else {
        purchaseBtn.style.display = 'inline-flex';
        discussionBtn.classList.add('hidden');
      }
    } else {
      purchaseBtn.style.display = 'inline-flex';
      discussionBtn.classList.add('hidden');
    }

    this.showPage('bookDetailPage');
  }

  showDiscussion(bookId) {
    const book = getBook(bookId);
    if (!book) return;

    // Check access
    if (!auth.canAccessDiscussion(parseInt(bookId))) {
      alert('이 토론에 참여하려면 먼저 책을 구매해야 합니다.');
      return;
    }

    document.getElementById('discussionTitle').textContent = `${book.title} - 토론`;
    this.renderPosts(bookId);
    this.showPage('discussionPage');
  }

  renderPosts(bookId) {
    const posts = getPosts(parseInt(bookId));
    const postsList = document.getElementById('postsList');
    
    if (!postsList) return;

    if (posts.length === 0) {
      postsList.innerHTML = `
        <div class="no-posts">
          <p>아직 게시글이 없습니다. 첫 번째 게시글을 작성해보세요!</p>
        </div>
      `;
      return;
    }

    postsList.innerHTML = posts.map(post => `
      <div class="post-card">
        <div class="post-header">
          <div class="post-meta">
            <div class="author-info">
              <div class="author-avatar">${post.author.charAt(0)}</div>
              <div>
                <div class="author-name">${post.author}</div>
                <div class="post-date">${this.formatDate(post.date)}</div>
              </div>
            </div>
          </div>
          <div class="author-role">${this.getRoleLabel(post.authorRole)}</div>
        </div>
        <h3 class="post-title">${post.title}</h3>
        <div class="post-content">${post.content}</div>
        <div class="post-actions">
          <div class="post-action">
            <span>👍</span>
            <span>${post.likes}</span>
          </div>
          <div class="post-action">
            <span>💬</span>
            <span>${post.comments}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  getCategoryLabel(category) {
    const labels = {
      frontend: '프론트엔드',
      backend: '백엔드',
      algorithm: '알고리즘',
      architecture: '아키텍처'
    };
    return labels[category] || category;
  }

  getRoleLabel(role) {
    const labels = {
      student: '학생',
      junior: '신입',
      senior: '시니어',
      other: '기타'
    };
    return labels[role] || role;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  }

  setFilter(filter) {
    this.currentFilter = filter;
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    // Re-render books
    this.renderBooks();
  }

  showNotification(message, type = 'info') {
    // Simple notification (could be enhanced)
    alert(message);
  }
}

// Create global UI manager instance
const ui = new UIManager();