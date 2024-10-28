export default function Recruit() {
  return (
    <main>
      <div class="form-container">
        <h2>Create New Listing</h2>
        <form action="#" method="POST">
          <div class="form-group">
            <label for="organization">Organization</label>
            <input type="text" id="organization" name="organization" class="form-input" placeholder="Enter organization name" required/>
          </div>
  
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" class="form-input" placeholder="Enter a brief description" rows="4" required></textarea>
          </div>
          
          <div class="form-group">
            <label for="city">City</label>
            <select id="city" name="city" class="form-input">
              <option value="">Select City</option>
              <option value="langley">Langley</option>
              <option value="vancouver">Vancouver</option>
              <option value="abbotsford">Abbotsford</option>
              <option value="surrey">Surrey</option>
            </select>
          </div>
  
          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" name="category" class="form-input">
              <option value="">Select Category</option>
              <option value="health">Health</option>
              <option value="food">Food</option>
              <option value="community">Community</option>
            </select>
          </div>
          
          <button type="submit" class="form-button">Create Listing</button>
        </form>
      </div>
    </main>  
  )
}
