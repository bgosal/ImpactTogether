export default function Saved() {
  return (
    <main>
      <section class="item-container">
        <div class="filter-section">
          <input type="text" placeholder="Search..." class="filter-input"/>
          <select class="filter-dropdown">
            <option value="">Select City</option>
            <option value="langley">Langley</option>
            <option value="vancouver">Vancouver</option>
            <option value="abbotsford">Abbotsford</option>
            <option value="surrey">Surrey</option>
          </select>
          <select class="filter-dropdown">
            <option value="">Select Category</option>
            <option value="health">Health</option>
            <option value="food">Food</option>
            <option value="community">Community</option>
          </select>
          <button class="filter-button">Apply Filters</button>
        </div>

        <div class="item-list">
          <div class="item">
            {/* <img src="https://via.placeholder.com/100" alt="Item Image" class="item-image"> */}
            <div class="item-description">
              <h3>Item 1</h3>
              <p>This is a short description of item 1. It is designed to give a brief overview.</p>
            </div>
            <div class="item-buttons">
              <button class="item-button">Cancel</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
