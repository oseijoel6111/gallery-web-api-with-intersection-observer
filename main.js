const CLIENT_ID = "provide your client key here";
const imgContainer = document.querySelector("#imgContainer");

const perPage = 10;
let page = 1; 

const getRandomPhotos = async () => {
  return await axios.get(
    `https://api.unsplash.com/photos/?client_id=${CLIENT_ID}&per_page=${perPage}&page=${page}`
  );
};

const singleImage = (image) => {
  const imageElement = document.createElement("div");
  imageElement.classList.add("col-sm-6", "mt-2");
  imageElement.innerHTML = `
    <div class="thumbnail">
      <a class="pop-up" href="${image.urls.regular}">
        <img data-src="${image.urls.full}" style="object-fit: cover;" loading="lazy" />
      </a>
    </div>
  `;

  // Initialize the pop-up using a library like Magnific Popup
  $(".pop-up").magnificPopup({
    type: "image",
    closeOnContentClick: true,
    mainClass: "mfp-img-mobile",
    image: {
      verticalFit: true,
    },
    gallery: {
      enabled: true,
    },
  });

  return imageElement;
};

const loadMoreImages = async () => {
  const photos = await getRandomPhotos();
  photos.data.forEach((photo) => {
    imgContainer.appendChild(singleImage(photo));
  });

  // Create Intersection Observer for new images
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target.querySelector("img");
        if (img && img.dataset.src) {
          img.src = img.dataset.src;
          observer.unobserve(entry.target);
        }
      }
    });
  });

  // Observe the new images
  imgContainer.querySelectorAll(".thumbnail").forEach((thumbnail) => {
    observer.observe(thumbnail);
  });

  page++; 
};

// Function to check if the user has scrolled to the bottom of the page
const isAtBottom = () => {
  const scrollPosition = window.innerHeight + window.scrollY;
  return scrollPosition >= document.body.offsetHeight - 500; 
};

// Listen for scroll events to trigger loading more images
window.addEventListener("scroll", () => {
  if (isAtBottom()) {
    loadMoreImages();
  }
});

// Initial load of images
loadMoreImages();
