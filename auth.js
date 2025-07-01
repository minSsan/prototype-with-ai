// Authentication system
class AuthSystem {
  constructor() {
    this.currentUser = null;
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    const userData = localStorage.getItem('devbooks_current_user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  saveCurrentUser() {
    if (this.currentUser) {
      localStorage.setItem('devbooks_current_user', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('devbooks_current_user');
    }
  }

  login(email, password) {
    const user = findUser(email, password);
    if (user) {
      this.currentUser = user;
      this.saveCurrentUser();
      return { success: true, user };
    }
    return { success: false, message: '이메일 또는 비밀번호가 잘못되었습니다.' };
  }

  signup(userData) {
    const users = getUsers();
    const existingUser = users.find(user => user.email === userData.email);
    
    if (existingUser) {
      return { success: false, message: '이미 존재하는 이메일입니다.' };
    }

    const newUser = addUser(userData);
    this.currentUser = newUser;
    this.saveCurrentUser();
    return { success: true, user: newUser };
  }

  logout() {
    this.currentUser = null;
    this.saveCurrentUser();
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  canAccessDiscussion(bookId) {
    if (!this.isLoggedIn()) return false;
    return hasPurchased(this.currentUser.id, bookId);
  }

  purchaseBook(bookId) {
    if (!this.isLoggedIn()) return false;
    
    addPurchase(this.currentUser.id, bookId);
    
    // Update current user data
    const users = getUsers();
    this.currentUser = users.find(u => u.id === this.currentUser.id);
    this.saveCurrentUser();
    
    return true;
  }
}

// Create global auth instance
const auth = new AuthSystem();