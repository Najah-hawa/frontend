<template>
  <div class="container-fluid px-3 px-md-5 py-5 page-wrapper">
    
    <div class="row g-3 mb-5 justify-content-center">
      <div class="col-12 col-md-5 col-lg-4">

         <router-link 
           to="/admin/add-category" 
           class="btn btn-outline-orange w-100 py-3 fw-bold text-uppercase tracking-wider btn-top-admin text-decoration-none d-block text-center">
          <i class="bi bi-plus-circle me-2 fs-5"></i>lägg till category
        </router-link>
      </div>
      <div class="col-12 col-md-5 col-lg-4">
        <router-link 
           to="/admin/add-product" 
           class="btn btn-orange w-100 py-3 fw-bold text-uppercase tracking-wider btn-top-admin text-decoration-none d-block text-center">
          <i class="bi bi-plus-circle me-2 fs-5"></i>lägg till produkt
        </router-link>
      </div>
    </div>

    <div class="row mb-5 justify-content-center">
      <div class="col-12 col-lg-10">
        <h3 class="category-title text-center py-3 shadow-sm rounded bg-white m-0">
          produkter i category : <span class="badge bg-orange-light text-orange px-3 py-2">Alla</span>
        </h3>
      </div>
    </div>

    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border text-orange" role="status"></div>
      <p class="text-muted mt-3 fw-medium">Hämtar produkter från lagret...</p>
    </div>

    <div v-if="errorMessage" class="alert alert-danger text-center shadow-sm" role="alert">
      <i class="bi bi-exclamation-octagon-fill me-2"></i>{{ errorMessage }}
    </div>

    <div v-if="!isLoading && products.length > 0" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 justify-content-center">
      <div class="col d-flex" v-for="product in products" :key="product._id">
        <div class="product-card p-3 shadow-sm w-100 d-flex flex-column justify-content-between bg-white">
          
          <div>
            <div class="d-flex flex-wrap gap-1 mb-3 spec-tags">
              <span class="badge tag-orange">{{ product.price }} kr</span>
              <span class="badge tag-orange" v-if="product.color">{{ product.color }}</span>
              <span class="badge tag-orange" v-if="product.size">{{ product.size }}</span>
            </div>

          <div class="image-placeholder mb-3 d-flex align-items-center justify-content-center overflow-hidden">
           <img 
              v-if="product.image && product.image.data && getProductImage(product).length > 50" 
              :src="getProductImage(product)" 
              :alt="product.name"
              class="product-real-image"
            />
           <i v-else class="bi bi-box-seam text-muted image-icon"></i> 
          </div>

            <div class="product-info mb-3 text-start">
              <h6 class="product-name mb-1 text-truncate" :title="product.name">{{ product.name }}</h6>
              <p class="product-desc text-muted mb-2 multi-line-truncate">{{ product.description || 'Ingen beskrivning tillgänglig' }}</p>
              <span class="product-cat-tag d-inline-block small">Kategori</span>
            </div>
          </div>

          <div>
            <div class="d-flex gap-2 mb-3">
              <button  @click="deleteProduct(product._id, product.name)" class="btn btn-action-danger btn-sm flex-grow-1 py-2 fw-semibold">radera</button>
              <button class="btn btn-action-secondary btn-sm flex-grow-1 py-2 fw-semibold">uppdatera</button>
            </div>

            <div class="stock-control d-flex align-items-center justify-content-between p-2 rounded shadow-inner">
              <button 
                @click="updateStock(product._id, 'decrease')" 
                class="btn btn-stock text-white fw-bold d-flex align-items-center justify-content-center"
              >
                -
              </button>
              <div class="text-center flex-grow-1">
                <span class="stock-number d-block fw-bold text-white">{{ product.stockQuantity }}</span>
              </div>
              <button 
                @click="updateStock(product._id, 'increase')" 
                class="btn btn-stock text-white fw-bold d-flex align-items-center justify-content-center"
              >
                +
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>

    <div v-if="!isLoading && products.length === 0" class="text-center my-5 p-5 bg-white rounded shadow-sm">
      <i class="bi bi-inbox text-muted d-block mb-3" style="font-size: 3rem;"></i>
      <p class="text-muted m-0 fw-medium">Inga produkter hittades i databasen.</p>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminView',
  data() {
    return {
      products: [],
      isLoading: false,
      errorMessage: ''
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    // 1. Hämta alla produkter
    async fetchProducts() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/products', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.products = response.data;
      } catch (err) {
        this.errorMessage = 'Kunde inte hämta produkter. Kontrollera serveranslutningen.';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    
    // 2. ta bort en produkt  
    async deleteProduct(productId, productName) {
      if (!confirm(`Är du säker på att du vill radera "${productName}"?`)) return;

      try {
        const token = localStorage.getItem('token');

        const response = await axios.delete(`http://localhost:3000/products/${productId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
       });

      if (response.status === 200 || response.status === 204) {
      // Ta bort produkten direkt från skärmen
      this.products = this.products.filter(p => p._id !== productId);
      alert(`"${productName}" har raderats.`);
      }
      } catch (err) {
      console.error('Kunde inte radera produkten:', err);
      alert('Ett fel uppstod på servern vid radering.');
      }
    },

    // 2. Uppdatera lagersaldo 
    async updateStock(productId, action) {
      try {
        const token = localStorage.getItem('token');
        const product = this.products.find(p => p._id === productId);
        if (action === 'decrease' && product.stockQuantity <= 0) return;

        const response = await axios.patch(`http://localhost:3000/products/${productId}/stock`, {
          action: action
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          product.stockQuantity = response.data.stockQuantity;
        }
      } catch (err) {
        console.error('Kunde inte uppdatera lagersaldot:', err);
        alert('Ett fel uppstod vid uppdatering av lagersaldot.');
      }
    },

    // 3. Omvandla Buffer från MongoDB till Base64-sträng
    getProductImage(product) {
      if (!product.image || !product.image.data) return '';

      try {
        let binaryData = [];

        // Kollar om Mongoose har lagt bytesen i ett inre .data-fält
        if (product.image.data.data && Array.isArray(product.image.data.data)) {
          binaryData = product.image.data.data;
        } 
        else if (Array.isArray(product.image.data)) {
          binaryData = product.image.data;
        }

        if (binaryData.length === 0) return '';

        // Mappa binärdatan till en sträng
        const binaryString = binaryData.reduce((data, byte) => data + String.fromCharCode(byte), '');
        
        // Base64 koda
        const base64String = btoa(binaryString);
        
        const contentType = product.image.contentType || 'image/jpeg';
        
        return `data:${contentType};base64,${base64String}`;
      } catch (error) {
        console.error("Kunde inte omvandla buffer till bild:", error);
        return '';
      }
    }
  }
};
</script>

<style scoped>
.page-wrapper {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.btn-top-admin {
  font-size: 1rem;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
}

.btn-orange {
  background-color: #e65c00;
  border: none;
  color: white;
  border-radius: 8px;
  transition: all 0.2s ease;
}
.btn-orange:hover {
  background-color: #b34700;
  transform: translateY(-1px);
}

.btn-outline-orange {
  border: 2px solid #e65c00;
  color: #e65c00;
  background-color: white;
  border-radius: 8px;
  transition: all 0.2s ease;
}
.btn-outline-orange:hover {
  background-color: rgba(230, 92, 0, 0.04);
  color: #b34700;
  border-color: #b34700;
  transform: translateY(-1px);
}

.category-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2b2b2b;
  border: 1px solid rgba(230, 92, 0, 0.05);
}
.bg-orange-light {
  background-color: rgba(230, 92, 0, 0.08);
}
.text-orange {
  color: #e65c00 !important;
}

.product-card {
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06) !important;
}

.spec-tags .tag-orange {
  background-color: #e65c00;
  color: white;
  font-weight: 600;
  font-size: 0.7rem;
  padding: 5px 8px;
  border-radius: 6px;
}

.image-placeholder {
  background-color: #f1f1f1;
  height: 140px; 
  border-radius: 10px;
}
.product-real-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.image-icon {
  font-size: 2.5rem;
}

.product-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
}
.product-desc {
  font-size: 0.85rem;
  line-height: 1.4;
  height: 2.8em; 
}

.multi-line-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

.product-cat-tag {
  background-color: #6c757d;
  color: white;
  padding: 2px 8px;
  border-radius: 5px;
  font-size: 0.65rem;
}

.btn-action-danger {
  background-color: #dc3545;
  color: white;
  font-size: 0.75rem;
  border: none;
  border-radius: 6px;
}
.btn-action-secondary {
  background-color: #495057;
  color: white;
  font-size: 0.75rem;
  border: none;
  border-radius: 6px;
}

.stock-control {
  background-color: #1e2125;
}
.btn-stock {
  background-color: #e65c00;
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 1.3rem;
}
.btn-stock:hover {
  background-color: #b34700;
}
.stock-number {
  font-size: 1.4rem;
}
.stock-label, .stock-sub-label {
  font-size: 0.55rem;
  font-weight: 600;
}
</style>