<template>
  <div class="login-wrapper d-flex align-items-center justify-content-center">
    <div class="login-card p-4 shadow">


      <div v-if="errorMessage" class="alert alert-danger p-2 text-center small" role="alert">
        {{ errorMessage }}
      </div>
      <div v-if="authMessage" class="alert alert-warning p-2 text-center small" role="alert">
        {{ authMessage }}
      </div>

      <h1 class="text-center login-title mb-4">Logga in</h1>


      <form @submit.prevent="handleLogin">
        
        <div class="d-flex align-items-center mb-3">
          <i class="bi bi-person login-icon me-3"></i>
          <div class="flex-grow-1">
            <input 
              type="email" 
              class="form-control custom-input" 
              placeholder="email"
              v-model="email"
              required
            />
          </div>
        </div>

        <div class="d-flex align-items-center mb-4">
          <i class="bi bi-lock login-icon me-3"></i>
          <div class="flex-grow-1">
            <input 
              type="password" 
              class="form-control custom-input" 
              placeholder="password"
              v-model="password"
              required
            />
          </div>
        </div>

        <div class="d-flex align-items-center mb-4">
         <i class="bi bi-box-arrow-in-right login-icon me-3"></i>
         <div class="flex-grow-1">
          <button type="submit" class="btn btn-orange w-100 d-flex align-items-center justify-content-start ps-3" :disabled="isLoading">
           <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
           Logga in
          </button>
         </div>
        </div>

        <div class="text-center">
          <a href="#" class="forgot-password-link small">glömt lösenordet?</a>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      authMessage: '',
      isLoading: false
    };
  },
  mounted() {
    // Kolla om det finns en token i localStorage
   if (this.$route.query.alert) {
      this.authMessage = this.$route.query.alert;
      
      // Rensar adressraden så att den ser ren ut efter att texten hamnat på skärmen
      this.$router.replace({ query: null });
    }
  },
  methods: {
    async handleLogin() {
      this.errorMessage = '';
      this.isLoading = true;

      try {
        // Vi använder Fetch API (eller Axios om du föredrar det senare)
        const response = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Inloggningen misslyckades');
        }

        // 1. Spara JWT-token och användarinfo i localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // 2. Skicka användaren vidare till adminsidan (/admin)
        this.$router.push('/admin');

      } catch (err) {
        this.errorMessage = err.message;
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Centrerar hela kortet på skärmen */
.login-wrapper {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 15px;
}

/* Styla kortet utifrån Figma-skissen */
.login-card {
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 380px; 
  border: 1px solid rgba(230, 92, 0, 0.1);
}

/* Rubriken i orangea färg */
.login-title {
  color: #e65c00; 
  font-weight: 700;
  font-size: 2rem;
}

/* Ikonernas styling */
.login-icon {
  font-size: 1.8rem;
  color: #e65c00;
  width: 30px;
  text-align: center;
}

/* Inmatningsfälten med orange ram */
.custom-input {
  border: 2px solid #e65c00;
  border-radius: 8px;
  padding: 10px 15px;
  background-color: #ffffff;
  color: #333;
}

.custom-input:focus {
  border-color: #b34700;
  box-shadow: 0 0 0 0.2rem rgba(230, 92, 0, 0.25);
  outline: none;
}

/* Platshållartexten i fälten */
.custom-input::placeholder {
  color: rgba(230, 92, 0, 0.6);
}

/* Solid orange knapp */
.btn-orange {
  background-color: #e65c00;
  border: none;
  color: #ffffff;
  padding: 11px;
  font-weight: 600;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.btn-orange:hover {
  background-color: #b34700;
}

.btn-orange:disabled {
  background-color: #ff944d;
}

/* Glömt lösenord länk */
.forgot-password-link {
  color: #e65c00;
  text-decoration: none;
  font-weight: 500;
}

.forgot-password-link:hover {
  text-decoration: underline;
  color: #b34700;
}
</style>