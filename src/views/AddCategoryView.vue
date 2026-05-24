<template>
  <div class="container my-5 add-category-container">
    <div class="row justify-content-center">
      <div class="col-12 ">
        
        <div class="form-card rounded-3 overflow-hidden bg-white shadow-sm border-0">
          
          <div class="form-header-block p-4 text-center">
            <h2 class="form-title m-0 fw-bold text-lowercase text-white">lägg till en kategori</h2>
          </div>
          
          <div class="p-4 p-sm-5">
            
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

            <form @submit.prevent="submitCategory">
              
              <div class="mb-4">
                <input 
                  v-model="category.name"
                  type="text" 
                  class="form-control custom-input" 
                  placeholder="category name" 
                  required
                />
              </div>

              <div class="mb-4">
                <textarea 
                  v-model="category.description"
                  class="form-control custom-input custom-textarea" 
                  placeholder="description (optional)" 
                  rows="4"
                ></textarea>
              </div>

              <div class="mb-4 px-1 d-flex align-items-center justify-content-between status-box rounded p-3 bg-light">
                <div>
                  <span class="status-label d-block fw-semibold text-lowercase">aktiv kategori</span>
                  <small class="text-muted text-lowercase">synlig för kunder i butiken</small>
                </div>
                <div class="form-check form-switch m-0">
                  <input 
                    v-model="category.active"
                    class="form-check-input custom-switch" 
                    type="checkbox" 
                    id="categoryActive"
                  >
                </div>
              </div>

              <div class="text-center mt-5">
                <button 
                  type="submit" 
                  class="btn btn-submit-orange px-5 py-2.5 fw-semibold text-lowercase shadow-sm"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'sparar...' : 'lägg till kategori' }}
                </button>
              </div>

            </form>
          </div>
          
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AddCategoryView',
  data() {
    return {
      // Matchar din Mongoose CategorySchema exakt
      category: {
        name: '',
        description: '',
        active: true // Default-värde enligt din backend-modell
      },
      isSubmitting: false,
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    async submitCategory() {
      this.errorMessage = '';
      this.successMessage = '';
      this.isSubmitting = true;

      try {
        // Hämta din JWT-token
        const token = localStorage.getItem('token');

        // Eftersom vi inte skickar bilder här, skickar vi ett vanligt JSON-objekt till din Hapi-server på port 3000
        const response = await axios.post('http://localhost:3000/categories', this.category, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Kontrollera att sparningen gick bra (Hapi skickar 200 eller 201 vid save)
        if (response.status === 200 || response.status === 201) {
          this.successMessage = 'Kategorin har skapats framgångsrikt!';
          this.resetForm();

          // Valfritt: Gå till admin efter 2 sekunder
          setTimeout(() => {
            this.$router.push('/admin');
          }, 2000);
        }

      } catch (error) {
        console.error('Fel vid skapande av kategori:', error);
        // Fånga upp felmeddelanden från din databas (t.ex. om namnet är för kort eller redan finns)
        this.errorMessage = error.response?.data?.error || 'Ett fel uppstod när kategorin skulle sparas.';
      } finally {
        this.isSubmitting = false;
      }
    },

    resetForm() {
      this.category = {
        name: '',
        description: '',
        active: true
      };
    }
  }
};
</script>

<style scoped>
/* EXAKT SAMMA DESIGN SOM PRODUKTSIDAN FÖR EN ENHETLIG LOOK */
.add-category-container {
  font-family: sans-serif;
  background-color: #fafafa;
  min-height: 80vh;
}

.form-header-block {
  background-color: #e65c00; /* Din signatur-orange */
}

.form-title {
  font-size: 1.6rem;
  letter-spacing: 0.5px;
}

.form-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06) !important;
}

.custom-input {
  background-color: #ffffff !important;
  border: 1px solid #cccccc !important;
  border-radius: 6px;
  padding: 14px 18px;
  color: #000000 !important;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.custom-input::placeholder {
  color: #888888;
  text-transform: lowercase;
}

.custom-input:focus {
  border-color: #e65c00 !important;
  box-shadow: 0 0 0 3px rgba(230, 92, 0, 0.15) !important;
  outline: none;
}

.custom-textarea {
  resize: none;
}

/* Statusboxen för Aktiva/Inaktiva val */
.status-box {
  border: 1px solid #e0e0e0;
}

.status-label {
  color: #222222;
  font-size: 0.95rem;
}

/* Snygg anpassning av Bootstraps switch till din orangea färg */
.custom-switch {
  cursor: pointer;
  width: 2.5em !important;
  height: 1.25em !important;
}

.custom-switch:checked {
  background-color: #e65c00 !important;
  border-color: #e65c00 !important;
}

.custom-switch:focus {
  box-shadow: 0 0 0 3px rgba(230, 92, 0, 0.15) !important;
  border-color: #e65c00 !important;
}

/* Spara-knappen */
.btn-submit-orange {
  background-color: #e65c00;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 1.05rem;
  padding: 12px 60px !important;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.btn-submit-orange:hover {
  background-color: #cc5200;
  color: #ffffff;
}

.btn-submit-orange:active {
  transform: scale(0.98);
}

@media (max-width: 475px) {
  .form-card .p-4 {
    padding: 1.75rem !important;
  }
}
</style>