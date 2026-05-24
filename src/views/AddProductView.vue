<template>
  <div class="container my-5 add-product-container">
    <div class="row justify-content-center">
      <div class="col-12 ">
        
        <div class="form-card rounded-3 overflow-hidden bg-white shadow-sm border-0">
          
          <div class="form-header-block p-4 text-center">
            <h2 class="form-title m-0 fw-bold text-lowercase text-white">lägg till en produkt</h2>
          </div>
          
          <div class="p-4 p-sm-5">
            <form @submit.prevent>
              
              <div class="mb-4">
                <input 
                  type="text" 
                  class="form-control custom-input" 
                  placeholder="name" 
                />
              </div>

              <div class="mb-4">
                <textarea 
                  class="form-control custom-input custom-textarea" 
                  placeholder="description" 
                  rows="4"
                ></textarea>
              </div>

              <div class="mb-4">
                <input 
                  type="number" 
                  class="form-control custom-input" 
                  placeholder="StockQuantity" 
                />
              </div>

              <div class="mb-4">
                <input 
                  type="number" 
                  class="form-control custom-input" 
                  placeholder="pris" 
                />
              </div>

              <div class="mb-4">
                <div class="size-selector d-flex align-items-center flex-wrap gap-2 py-2 px-3 rounded bg-white">
                  <span class="size-label me-2">size:</span>
                  <button type="button" class="btn btn-size-badge">xs</button>
                  <button type="button" class="btn btn-size-badge">s</button>
                  <button type="button" class="btn btn-size-badge">m</button>
                  <button type="button" class="btn btn-size-badge">L</button>
                  <button type="button" class="btn btn-size-badge">xl</button>
                  <button type="button" class="btn btn-size-badge">xxl</button>
                </div>
              </div>

              <div class="mb-4">
                <input 
                  type="text" 
                  class="form-control custom-input" 
                  placeholder="color" 
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
                  />
                </div>
              </div>

              <div class="text-center mt-5">
                <button type="button" class="btn btn-submit-orange px-5 py-2.5 fw-semibold text-lowercase shadow-sm">
                  lägg till produkt
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
export default {
  name: 'AddProductView'
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