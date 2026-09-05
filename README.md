# The Barber Studio

Build a Premium, Modern & Fully Dynamic Barber Salon Website

Create a premium, modern, highly responsive barber salon website with a luxurious and creative visual identity. The website should feel like a real professional salon brand website, not a basic template.

The website must have two major sides:

1. Customer-facing website
2. Secure Admin Panel

The entire website should be fully dynamic, so the salon owner/admin can update content, prices, offers, images, hairstyles, services, etc. from the Admin Panel without touching or editing the code.

---

1. BRAND INTRO / SPLASH SCREEN

Whenever a visitor opens or refreshes the website:

- Show the barber shop's logo prominently in the center.
- Use a premium, smooth animation.
- Logo should remain visible for approximately 2–3 seconds.
- Add a subtle fade-in/fade-out or elegant reveal animation.
- After the splash screen, smoothly transition to the main homepage.
- Do not make the loading experience annoying or slow.
- On subsequent navigation, the experience should remain fast.

The logo should be manageable from the Admin Panel so the admin can replace it whenever required.

---

2. HOMEPAGE — GENDER SELECTION

After the splash screen, the first major screen should be a visually impressive Gender Selection section.

Display two large interactive options:

MEN

"Men's Grooming"

WOMEN

"Women's Beauty"

Use two premium cards/buttons with attractive imagery, animations, hover effects and modern typography.

The design should immediately communicate that this is a premium grooming/beauty business.

When the customer clicks:

MEN

Open the complete Men's section.

WOMEN

Open the complete Women's section.

---

3. MEN'S SECTION

Create a dedicated Men's experience containing dynamically managed content such as:

Services

Examples:

- Haircut
- Hair Styling
- Beard Styling
- Beard Trim
- Hair + Beard Combo
- Facial
- Head Massage
- Hair Spa
- Coloring
- Premium Grooming Packages

Each service should support:

- Service name
- Description
- Price
- Discounted price
- Service image
- Duration
- Offer/badge
- Availability/status

All of these must be editable from the Admin Panel.

---

4. WOMEN'S SECTION

Create a dedicated Women's experience.

Possible categories:

Hair

- Haircut
- Hair Styling
- Hair Spa
- Hair Coloring
- Hair Treatment

Beauty

- Facial
- Cleanup
- Waxing
- Threading
- Manicure
- Pedicure
- Makeup

Packages

Create attractive packages/combo offers.

Every service/package should have:

- Name
- Description
- Original price
- Offer price
- Image
- Duration
- Category
- Offer badge
- Active/inactive status

Everything must be dynamically editable from the Admin Panel.

---

5. HAIRSTYLE / GALLERY SECTION

Create a beautiful visual gallery for hairstyles and grooming styles.

Examples:

- Trending Hairstyles
- Classic Cuts
- Modern Cuts
- Beard Styles
- Hair Color
- Women's Hairstyles
- Bridal/Party Looks

Use a premium image grid/masonry-style layout.

Images must NOT be hardcoded.

The admin should be able to:

- Upload new images
- Replace images
- Delete images
- Add titles
- Add descriptions
- Assign categories
- Reorder images
- Enable/disable images

The website should automatically reflect these changes.

---

6. OFFERS & DEALS

Create a highly visible Offers / Deals section.

Examples:

- 20% OFF Haircut
- Hair + Beard Combo
- Weekend Special
- New Customer Offer
- Festival Offers
- Premium Grooming Package

Each offer should support:

- Offer title
- Description
- Original price
- Discounted price
- Percentage discount
- Banner/image
- Start date
- End date
- Active/inactive status
- Men's/Women's category

Expired offers should automatically stop appearing as active offers.

---

7. DAILY / LIVE UPDATES

The website should support dynamic updates.

The admin should be able to publish:

- Daily offers
- New services
- Price drops
- New hairstyles
- Announcements
- Festival promotions
- Limited-time deals
- New photos
- Salon updates

The admin should simply update these from the dashboard and the customer website should automatically show the latest information.

No code editing should be required.

---

8. PRICE MANAGEMENT

Create a proper dynamic pricing system.

Admin should be able to:

- Add services
- Edit prices
- Delete services
- Change prices
- Add discounts
- Create combo prices
- Mark services as "On Offer"
- Show original price with strikethrough
- Show discounted price
- Activate/deactivate services

Example:

/₹500/ → ₹399

These changes should automatically appear on the live customer website.

---

9. BOOKING / APPOINTMENT SYSTEM

Include a professional appointment booking system.

Customer should be able to select:

1. Men's / Women's
2. Service
3. Date
4. Available time slot
5. Name
6. Phone number
7. Optional message

After booking:

- Show booking confirmation.
- Store booking information in the database.
- Admin should be able to see all bookings from the Admin Panel.
- Admin should be able to change booking status:
  - Pending
  - Confirmed
  - Completed
  - Cancelled

If appropriate, provide WhatsApp integration for appointment confirmation.

---

10. ADMIN PANEL

Create a completely separate and secure Admin Dashboard.

The Admin Panel must NOT be publicly accessible without authentication.

Use secure authentication such as:

- Email/password
- Secure session handling
- Protected admin routes
- Logout functionality
- Password reset if supported

---

ADMIN DASHBOARD

The dashboard should show useful statistics:

- Total bookings
- Today's bookings
- Pending bookings
- Completed bookings
- Active offers
- Total services
- Recent updates

Use clean cards, charts and tables where appropriate.

---

11. CONTENT MANAGEMENT SYSTEM

The Admin Panel should work like a simple CMS.

Admin should be able to manage:

Homepage

- Logo
- Hero images
- Text
- Gender selection images
- Promotional banners

Men's Content

- Services
- Prices
- Offers
- Hairstyles
- Gallery
- Packages

Women's Content

- Services
- Prices
- Offers
- Hairstyles
- Gallery
- Packages

General Content

- About the salon
- Contact information
- Address
- Opening hours
- Phone number
- WhatsApp number
- Instagram link
- Social media links

Admin must be able to edit everything without touching source code.

---

12. IMAGE MANAGEMENT

This is extremely important.

Images should be stored using proper cloud/database storage rather than being permanently hardcoded inside the frontend.

Admin should be able to:

- Upload image
- Preview image
- Replace image
- Delete image
- Change gallery images
- Change service images
- Change offer banners
- Change hairstyle photos
- Change homepage images
- Change logo

Use an appropriate image storage solution.

---

13. REAL-TIME / DYNAMIC DATA

The website must be connected to a proper backend/database.

Do NOT create a static frontend with hardcoded data.

Use a proper architecture such as:

Frontend → Backend/API → Database + Image Storage

Any changes made through the Admin Panel should immediately or near-immediately reflect on the customer-facing website.

For example:

Admin changes:

Haircut ₹500 → ₹399

Customer website should automatically show:

₹399

No developer intervention or code editing should be required.

---

14. RESPONSIVE DESIGN

The website must be fully responsive.

It should work beautifully on:

- Mobile phones
- Tablets
- Laptops
- Desktop monitors

Design mobile-first where appropriate.

The mobile experience is especially important because most salon customers will likely access the website through their phones.

---

15. DESIGN DIRECTION

The visual design should be:

- Premium
- Modern
- Elegant
- Minimal
- Stylish
- High-end salon/barber aesthetic
- Professional
- Visually rich but not cluttered

Use:

- Beautiful typography
- Large premium imagery
- Smooth transitions
- Subtle animations
- Modern cards
- Elegant buttons
- Clean spacing
- Premium navigation
- Micro-interactions

Avoid:

- Generic template appearance
- Excessive animations
- Cheap-looking gradients
- Cluttered layouts
- Too many colors
- Poor typography
- Stock-template feel

The final result should look like a website designed by a professional UI/UX agency for a premium salon brand.

---

16. NAVIGATION

Create a clean navigation system.

Possible navigation:

- Home
- Men's
- Women's
- Services
- Offers
- Gallery
- About
- Contact
- Book Appointment

On mobile, use a polished hamburger menu.

---

17. CONTACT & LOCATION

Create a contact section containing:

- Salon address
- Phone number
- WhatsApp
- Opening hours
- Google Maps location
- Instagram
- Other social media

Provide clear CTA buttons such as:

Book Appointment

Call Now

WhatsApp Us

---

18. SEO & PERFORMANCE

Implement basic production-ready SEO:

- Proper page titles
- Meta descriptions
- Semantic HTML
- Image alt text
- Open Graph metadata
- Clean URLs
- Mobile optimization

Optimize images and loading performance.

Use lazy loading where appropriate.

The website should feel fast and smooth.

---

19. ADMIN USER EXPERIENCE

The Admin Panel should be extremely simple for a non-technical salon owner.

The admin should NOT need programming knowledge.

For example:

Services → Men's → Haircut → Edit → Change Price → Save

or

Gallery → Upload Image → Select Category → Publish

or

Offers → Add Offer → Set Discount → Set Expiry → Publish

Make the admin interface intuitive and self-explanatory.

---

20. DATABASE STRUCTURE

Create a clean scalable database structure for:

- Admin users
- Services
- Categories
- Men's services
- Women's services
- Offers
- Packages
- Gallery
- Hairstyles
- Homepage content
- Banners
- Bookings
- Business information
- Announcements
- Settings

Use proper relationships and validation.

---

21. SECURITY

Implement:

- Secure authentication
- Protected admin routes
- Authorization checks
- Input validation
- Secure database access
- Secure image upload handling
- Protection against unauthorized admin access

Customers must never be able to access or modify the Admin Panel.

---

22. IMPORTANT REQUIREMENT

This is NOT supposed to be only a visual demo.

Build it as a real working dynamic website.

Do not hardcode salon services, prices, offers, gallery images or promotional content into the frontend.

All frequently changing content should come from the database/backend.

The final architecture should allow the salon owner to operate the website independently after deployment.

---

23. TECH STACK

Choose a modern, production-ready technology stack.

Recommended:

- Modern React / Next.js frontend
- TypeScript
- Tailwind CSS or equivalent modern styling system
- Supabase/Firebase or another suitable backend
- Database for dynamic content
- Cloud storage for images
- Secure authentication for Admin Panel

Choose the stack that best fits the platform, but ensure that the result is actually functional and deployable.

---

24. FINAL GOAL

The final product should feel like a premium real-world barber & beauty salon platform, not a simple portfolio website.

The customer experience should be:

Open Website → Logo Splash → Choose Men/Women → Explore Services → View Offers/Styles → Select Service → Book Appointment

The salon owner's experience should be:

Login → Admin Dashboard → Update Services/Prices/Offers/Images/Hairstyles/Announcements → Save → Website Automatically Updates

Make the entire experience polished, modern, fast, responsive, secure and production-ready.

Before considering the project complete, verify that:

- Customer website works
- Men/Women selection works
- Admin authentication works
- Admin CRUD operations work
- Database is connected
- Image upload/replacement works
- Offers work
- Price updates work
- Gallery updates work
- Booking system works
- Changes made in Admin Panel appear on the customer website
- Mobile responsiveness works
- No important customer-facing content is hardcoded
- There are no obvious broken links, buttons or placeholder sections

Build the project with clean, maintainable and scalable code so additional features can be added later.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1ebebfb4-31af-4fd1-89a1-ce6323f505b1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
