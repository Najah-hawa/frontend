<template>
  <div class="container my-5 add-product-container">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-7 col-xl-6">
        
        <div class="form-card rounded-3 overflow-hidden bg-white shadow-sm border-0">
          
          <div class="form-header-block p-4 text-center">
            <h2 class="form-title m-0 fw-bold text-lowercase text-white">uppdatera produkt</h2>
          </div>
          
          <div class="p-4 p-sm-5">
            
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
            
            <div v-if="isFetching" class="text-center my-4">
              <div class="spinner-border text-orange" role="status"></div>
              <p class="text-muted mt-2 small text-lowercase">hämtar produktinfo...</p>
            </div>

            <form v-else @submit.prevent="submitUpdate">
              
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
                  v-model.number="product.stockQuantity"
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
                  <option value="" disabled hidden>välj kategori</option>
                  <option 
                    v-for="cat in categories" 
                    :key="cat._id" 
                    :value="cat._id"
                  >
                    {{ cat.name }}
                  </option>
                </select>
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
                  <label class="form-label upload-label mb-1" for="productImage">uppdatera bild (valfritt)</label>
                  <p class="text-muted small mb-3 text-lowercase">lämna tom för att behålla nuvarande bild</p>
                  
                  <div v-if="currentImagePreview && !selectedFile" class="current-image-preview mb-3 rounded overflow-hidden">
                    <img :src="currentImagePreview" alt="Nuvarande produktbild" />
                  </div>

                  <input 
                    type="file" 
                    id="productImage" 
                    class="form-control custom-file-input bg-white text-dark" 
                    accept="image/*"
                    @change="handleFileUpload"
                  />
                  <small v-if="imageName" class="text-muted mt-1">Vald ny fil: {{ imageName }}</small>
                </div>
              </div>

              <div class="text-center mt-5">
                <button 
                  type="submit" 
                  class="btn btn-submit-orange px-5 py-2.5 fw-semibold text-lowercase shadow-sm"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'sparar ändringar...' : 'spara ändringar' }}
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
  name: 'EditProductView',
  data() {
    return {
      productId: null,
      product: {
        name: '',
        description: '',
        stockQuantity: null,
        price: null,
        size: 's',
        color: '',
        category: ''
      },
      categories: [],
      selectedFile: null,
      imageName: '',
      currentImagePreview: '', // Sparar den gamla bildens base64 för förhandsvisning
      isFetching: false,
      isSubmitting: false,
      errorMessage: '',
      successMessage: ''
    };
  },
  async mounted() {
    this.productId = this.$route.params.id; // Fångar ID från routern, ex: /admin/edit-product/12345
    this.isFetching = true;
    
    // Vi hämtar både kategorier och produktens nuvarande info samtidigt
    await this.fetchCategories();
    await this.fetchProductDetails();
    
    this.isFetching = false;
  },
  methods: {
    // 1. Hämta kategorier till dropdownen
    async fetchCategories() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/categories', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        this.categories = response.data;
      } catch (err) {
        console.error('Kunde inte hämta kategorier:', err);
      }
    },

    // 2. Hämta produktens nuvarande värden från databasen
    async fetchProductDetails() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/products/${this.productId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const p = response.data;
        
        // Fyll i formulär-objektet (ta bara ID från kategorin om backend skickar ett populerat objekt)
        this.product = {
          name: p.name,
          description: p.description,
          stockQuantity: p.stockQuantity,
          price: p.price,
          size: p.size || 's',
          color: p.color,
          category: p.category?._id || p.category || ''
        };

        // Skapa en förhandsvisning av den befintliga bilden
        if (p.image && p.image.data) {
          this.currentImagePreview = this.convertBufferToDataUrl(p.image);
        }
      } catch (err) {
        console.error('Kunde inte hämta produktdetaljer:', err);
        this.errorMessage = 'Kunde inte ladda produktens information.';
      }
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.imageName = file.name;
      }
    },

    // 3. Skicka uppdateringen till din Hapi.js PUT-route
    async submitUpdate() {
      this.errorMessage = '';
      this.successMessage = '';
      this.isSubmitting = true;

      try {
        const formData = new FormData();
        formData.append('name', this.product.name);
        formData.append('description', this.product.description);
        formData.append('stockQuantity', this.product.stockQuantity);
        formData.append('price', this.product.price);
        formData.append('size', this.product.size);
        formData.append('color', this.product.color);
        formData.append('category', this.product.category);
        
        // Skicka bara med bilden om användaren faktiskt valt en NY fil
        if (this.selectedFile) {
          formData.append('image', this.selectedFile);
        }

        const token = localStorage.getItem('token');

        // Vi kör PUT mot din specifika produkt-url
        const response = await axios.put(`http://localhost:3000/products/${this.productId}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200) {
          this.successMessage = 'Produkten har uppdaterats framgångsrikt!';
          
          // Gå tillbaka till admin-panelen efter 2 sekunder
          setTimeout(() => {
            this.$router.push('/admin');
          }, 2000);
        }
      } catch (err) {
        console.error('Fel vid uppdatering:', err);
        this.errorMessage = err.response?.data?.error || 'Ett fel uppstod på servern vid uppdatering.';
      } finally {
        this.isSubmitting = false;
      }
    },

    // Hjälpmetod för att visa den gamla MongoDB-bildbuffern direkt i komponenten
    convertBufferToDataUrl(image) {
      try {
        let binaryData = image.data.data && Array.isArray(image.data.data) ? image.data.data : image.data;
        if (!binaryData || binaryData.length === 0) return '';
        const binaryString = binaryData.reduce((data, byte) => data + String.fromCharCode(byte), '');
        return `data:${image.contentType || 'image/jpeg'};base64,${btoa(binaryString)}`;
      } catch (e) {
        return '';
      }
    }
  }
};
</script>

<style scoped>
/* EXAKT SAMMA SKELETT OCH STYLING SOM ADD-PRODUCT */
.add-product-container {
  font-family: sans-serif;
  background-color: #fafafa;
  min-height: 80vh;
}
.form-header-block {
  background-color: #e65c00; 
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
}
.custom-input:focus {
  border-color: #e65c00 !important;
  box-shadow: 0 0 0 3px rgba(230, 92, 0, 0.15) !important;
  outline: none;
}
.custom-select {
  color: #000000 !important;
}
.custom-textarea {
  resize: none;
}
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
}
.btn-size-badge.active, .btn-size-badge:hover {
  background-color: #e65c00 !important;
  border-color: #e65c00 !important;
  color: #ffffff !important;
}
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

/* Liten extra styling för förhandsvisningen av nuvarande bild */
.current-image-preview {
  width: 90px;
  height: 90px;
  border: 1px solid #e0e0e0;
}
.current-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-submit-orange {
  background-color: #e65c00;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 1.05rem;
  padding: 12px 60px !important;
}
.btn-submit-orange:hover {
  background-color: #cc5200;
}
.text-orange {
  color: #e65c00 !important;
}
</style>