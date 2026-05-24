<template>
  <div class="container my-5 add-product-container">
    <div class="row justify-content-center">
      <div class="col-12 ">
        
        <div class="form-card rounded-3 overflow-hidden bg-white shadow-sm border-0">
          
          <div class="form-header-block p-4 text-center">
            <h2 class="form-title m-0 fw-bold text-lowercase text-white">lägg till en produkt</h2>
          </div>
          
          <div class="p-4 p-sm-5">
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>      

            <form @submit.prevent="submitProduct">
              
              <div class="mb-4">
                <input 
                  v-model="product.name"
                  type="text" 
                  class="form-control custom-input" 
                  placeholder="name" 
                  required
                />
              </div>

              <div class="mb-4">
                <textarea 
                  v-model="product.description"
                  class="form-control custom-input custom-textarea" 
                  placeholder="description" 
                  rows="4"
                  required
                ></textarea>
              </div>

              <div class="mb-4">
                <input 
                  v-model="product.stockQuantity"
                  type="number" 
                  class="form-control custom-input" 
                  placeholder="StockQuantity" 
                  min="0"
                  required
                />
              </div>

              <div class="mb-4">
                <input 
                  v-model.number="product.price"
                  type="number" 
                  class="form-control custom-input" 
                  placeholder="pris" 
                  min="0"
                  required
                />
              </div>
              <div class="mb-4">
                <select 
                  v-model="product.category"
                  class="form-select custom-input custom-select"
                  required
                >
                  <option value="" disabled selected hidden>välj kategori</option>
                  
                  <option 
                    v-for="cat in categories" 
                    :key="cat._id" 
                    :value="cat._id"
                  >
                    {{ cat.name }}
                  </option>
                </select>
                <div v-if="categories.length === 0" class="form-text text-danger ps-1 mt-1 text-lowercase">
                  hittade inga kategorier. skapa en kategori först!
                </div>
              </div>

              <div class="mb-4">
                <div class="size-selector d-flex align-items-center flex-wrap gap-2 py-2 px-3 rounded bg-white">
                  <span class="size-label me-2">size:</span>
                 <button 
                    v-for="s in ['xs', 's', 'm', 'L', 'xl', 'xxl']" 
                    :key="s"
                    type="button" 
                    class="btn btn-size-badge"
                    :class="{ active: product.size === s }"
                    @click="product.size = s"
                  >
                  </button>
                </div>
              </div>

              <div class="mb-4">
                <input 
                  v-model="product.color"
                  type="text" 
                  class="form-control custom-input" 
                  placeholder="color" 
                  required
                />
              </div>

              <div class="mb-4">
                <div class="upload-container p-3 d-flex flex-column align-items-start rounded bg-white">
                  <label class="form-label upload-label mb-2" for="productImage">upload image</label>
                  <input 
                    type="file" 
                    id="productImage" 
                    class="form-control custom-file-input bg-white text-dark" 
                    accept="image/*"
                    @change="handleFileUpload"
                    required
                  />
                  <small v-if="imageName" class="text-muted mt-1">Vald fil: {{ imageName }}</small>
                </div>
              </div>

              <div class="text-center mt-5">
                <button 
                  type="submit" 
                  class="btn btn-submit-orange px-5 py-2.5 fw-semibold text-lowercase shadow-sm"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'lägger till...' : 'lägg till produkt' }}
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
  name: 'AddProductView',
  data() {
    return {
      product: {
        name: '',
        description: '',
        stockQuantity: null,
        price: null,
        size: '', 
        color: '',
        category: '' 
      },
      categories: [],
      selectedFile: null,
      imageName: '',
      isSubmitting: false,
      errorMessage: '',
      successMessage: ''
    };
  },
  // mounted körs automatiskt så fort sidan laddas in i webbläsaren
  mounted() {
    this.fetchCategories();
  },
  methods: {
    // Hämtar alla kategorier från databasen på port 3000
    async fetchCategories() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/categories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Spara kategorierna i vår array (Hapi returnerar oftast datan direkt eller i response.data)
        this.categories = response.data;
      } catch (err) {
        console.error('Kunde inte hämta kategorier:', err);
        this.errorMessage = 'Kunde inte ladda in kategorier till menyn. Kontrollera din backend.';
      }
    },
    // Fånga upp bildfilen när användaren väljer en bild
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.imageName = file.name;
      }
    },

    // Skicka datan till backend
    async submitProduct() {
      this.errorMessage = '';
      this.successMessage = '';
      
      // Säkerställ att en bild har valts (krävs av din Hapi-backend)
      if (!this.selectedFile) {
        this.errorMessage = 'Du måste välja en produktbild.';
        return;
      }

      this.isSubmitting = true;

      try {
        // Skapa FormData eftersom vi skickar en binär bildfil
        const formData = new FormData();
        formData.append('name', this.product.name);
        formData.append('description', this.product.description);
        formData.append('stockQuantity', this.product.stockQuantity);
        formData.append('price', this.product.price);
        formData.append('size', this.product.size);
        formData.append('color', this.product.color);
        formData.append('category', this.product.category);
        formData.append('image', this.selectedFile); // Skickar filen direkt under nyckeln 'image'

        // Hämta JWT-token från localStorage
        const token = localStorage.getItem('token');

        // Skicka POST-förfrågan till din Hapi-server
        const response = await axios.post('http://localhost:3000/products', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' // Viktigt! Detta talar om att det är en fil med
          }
        });

        if (response.status === 201) {
          this.successMessage = 'Produkten har lagts till i databasen!';
          this.resetForm();
          
          // Valfritt: Navigera tillbaka till adminvyn efter 2 sekunder
          setTimeout(() => {
            this.$router.push('/admin'); // Justera sökvägen så den matchar din admin-route
          }, 2000);
        }

      } catch (err) {
        console.error('Fel vid skapande av produkt:', err);
        // Visa felmeddelandet från servern om det finns, annars ett generiskt
        this.errorMessage = err.response?.data?.error || 'Ett fel uppstod på servern vid sparande.';
      } finally {
        this.isSubmitting = false;
      }
    },

    // Töm formuläret efter lyckad sparning
    resetForm() {
      this.product = {
        name: '',
        description: '',
        stockQuantity: null,
        price: null,
        size: 's',
        color: '',
        category: '' // Behåll samma kategori-id
      };
      this.selectedFile = null;
      this.imageName = '';
      // Töm även fil-inputfältet i HTML-koden
      document.getElementById('productImage').value = '';
    }
  }
};
</script>

<style scoped>
.add-product-container {
  font-family: sans-serif;
  background-color: #fafafa; /* Ljus bakgrund på sidan */
  min-height: 80vh;
}

/* orangea färgblocket i toppen */
.form-header-block {
  background-color: #e65c00; 
}

.form-title {
  font-size: 1.6rem;
  letter-spacing: 0.5px;
}

/* Kortet */
.form-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06) !important;
}

/* Fälten: Ljusgrå städad ram, vit bakgrund och svart text */
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

/* Fokus-effekt: Ramen blir orange när man klickar i fältet */
.custom-input:focus {
  border-color: #e65c00 !important;
  box-shadow: 0 0 0 3px rgba(230, 92, 0, 0.15) !important;
  outline: none;
}
/* Styling för dropdown-pilen och texten i select-menyn */
.custom-select {
  cursor: pointer;
  color: #888888 !important; 
  text-transform: lowercase;
}

/* Ändrar textfärg till svart när man faktiskt har valt en kategori */
.custom-select:valid {
  color: #000000 !important;
}


.custom-textarea {
  resize: none;
}

/* Storleksväljaren */
.size-selector {
  border: 1px solid #cccccc;
  border-radius: 6px;
  min-height: 52px;
}

.size-label {
  color: #555555;
  font-weight: 500;
  font-size: 0.95rem;
}

.btn-size-badge {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  color: #333333;
  padding: 6px 14px;
  font-size: 0.95rem;
  text-transform: lowercase;
  border-radius: 4px;
  transition: all 0.15s ease;
}

/* Aktiv storlek eller vid hover blir orange */
.btn-size-badge.active, .btn-size-badge:hover {
  background-color: #e65c00 !important;
  border-color: #e65c00 !important;
  color: #ffffff !important;
}

/* Bild-uppladdningsboxen */
.upload-container {
  border: 1px solid #cccccc;
  border-radius: 6px;
}

.upload-label {
  color: #555555;
  font-weight: 500;
  font-size: 0.95rem;
}

.custom-file-input {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px 12px;
}

.custom-file-input:focus {
  border-color: #e65c00;
  box-shadow: 0 0 0 3px rgba(230, 92, 0, 0.15);
}

/* Knappen längst ner: Solid orange */
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

/* Responsivitet för mindre mobiler */
@media (max-width: 475px) {
  .form-card .p-4 {
    padding: 1.75rem !important;
  }
}
</style>