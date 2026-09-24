package com.agrilivestock.ecommerce.config;

import com.agrilivestock.ecommerce.entity.*;
import com.agrilivestock.ecommerce.enums.Role;
import com.agrilivestock.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final FaqRepository faqRepository;
    private final WhyChooseUsRepository whyChooseUsRepository;
    private final HowItWorksRepository howItWorksRepository;
    private final ContactQueryRepository contactQueryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (productRepository.count() > 0) {
            return; // Data already seeded
        }

        System.out.println("Seeding dummy data for Admin...");

        // 1. Create Users
        User admin = User.builder()
                .name("Admin User")
                .email("admin@punyakoti.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .emailVerified(true)
                .enabled(true)
                .mobileNumber(9999999999L)
                .build();
        
        User customer1 = User.builder()
                .name("John Doe")
                .email("john@example.com")
                .password(passwordEncoder.encode("password"))
                .role(Role.CUSTOMER)
                .emailVerified(true)
                .enabled(true)
                .mobileNumber(9876543210L)
                .build();
        
        User customer2 = User.builder()
                .name("Jane Smith")
                .email("jane@example.com")
                .password(passwordEncoder.encode("password"))
                .role(Role.CUSTOMER)
                .emailVerified(true)
                .enabled(true)
                .mobileNumber(9876543211L)
                .build();

        userRepository.saveAll(List.of(admin, customer1, customer2));

        // 2. Create Categories
        Category dairy = Category.builder()
                .name("Dairy Products")
                .description("Pure and organic dairy products directly from farm")
                .active(true)
                .build();
        
        Category sweets = Category.builder()
                .name("Traditional Sweets")
                .description("Authentic traditional Indian sweets")
                .active(true)
                .build();

        categoryRepository.saveAll(List.of(dairy, sweets));

        // 3. Create Products & Variants
        Product ghee = Product.builder()
                .category(dairy)
                .name("A2 Bilona Cow Ghee")
                .description("Pure A2 Bilona Cow Ghee made using traditional methods.")
                .benefits("Boosts immunity, improves digestion, good for heart.")
//                .nutritionalInfo("Rich in Omega 3, Vitamin A, D, E, and K.")
                .active(true)
//                .featured(true)
//                .basePrice(new BigDecimal("999.00"))
                .build();

        productRepository.save(ghee);

        ProductVariant ghee500 = ProductVariant.builder()
                .product(ghee)
                .weight("500ml")
                .price(new BigDecimal("999.00"))
                .stock(100)
                .sku("A2GHEE-500ML")
                .build();

        ProductVariant ghee1L = ProductVariant.builder()
                .product(ghee)
                .weight("1L")
                .price(new BigDecimal("1899.00"))
                .stock(50)
                .sku("A2GHEE-1L")
                .build();

        productVariantRepository.saveAll(List.of(ghee500, ghee1L));

        Product peda = Product.builder()
                .category(sweets)
                .name("Dharwad Peda")
                .description("Authentic Dharwad Peda made with pure milk.")
                .benefits("Delicious taste, traditional recipe.")
//                .nutritionalInfo("Contains milk solids, sugar, cardamom.")
                .active(true)
//                .featured(false)
//                .basePrice(new BigDecimal("250.00"))
                .build();

        productRepository.save(peda);

        ProductVariant peda250g = ProductVariant.builder()
                .product(peda)
                .weight("250g")
                .price(new BigDecimal("250.00"))
                .stock(200)
                .sku("PEDA-250G")
                .build();

        ProductVariant peda500g = ProductVariant.builder()
                .product(peda)
                .weight("500g")
                .price(new BigDecimal("480.00"))
                .stock(150)
                .sku("PEDA-500G")
                .build();

        productVariantRepository.saveAll(List.of(peda250g, peda500g));

        // 4. Create Orders
//        Order order1 = Order.builder()
//                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
//                .user(customer1)
//                .status(OrderStatus.DELIVERED)
//                .paymentMethod("ONLINE")
//                .paymentStatus("COMPLETED")
//                .subtotal(new BigDecimal("999.00"))
//                .tax(new BigDecimal("50.00"))
//                .shippingFee(new BigDecimal("0.00"))
//                .total(new BigDecimal("1049.00"))
//                .shipLine1("123 Main St")
//                .shipCity("Bengaluru")
//                .shipState("Karnataka")
//                .shipZip("560001")
//                .shipCountry("India")
//                .build();

//        OrderItem item1 = OrderItem.builder()
//                .order(order1)
//                .variant(ghee500)
//                .productName(ghee.getName())
//                .variantWeight(ghee500.getWeight())
//                .unitPrice(ghee500.getPrice())
//                .quantity(1)
//                .lineTotal(ghee500.getPrice())
//                .build();
//
//        order1.setItems(List.of(item1));
//
//        // Simulate a past order for trends
//        order1.setCreatedAt(Instant.now().minus(5, ChronoUnit.DAYS));

//        Order order2 = Order.builder()
//                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
//                .user(customer2)
//                .status(OrderStatus.PENDING)
//                .paymentMethod(PaymentMethod.CASH_ON_DELIVERY)
//                .paymentStatus(PaymentStatus.PENDING)
//                .subtotal(new BigDecimal("480.00"))
//                .tax(new BigDecimal("24.00"))
//                .shippingFee(new BigDecimal("50.00"))
//                .total(new BigDecimal("554.00"))
//                .shipLine1("456 MG Road")
//                .shipCity("Mysuru")
//                .shipState("Karnataka")
//                .shipZip("570001")
//                .shipCountry("India")
//                .build();

//        OrderItem item2 = OrderItem.builder()
//                .order(order2)
//                .variant(peda500g)
//                .productName(peda.getName())
//                .variantWeight(peda500g.getWeight())
//                .unitPrice(peda500g.getPrice())
//                .quantity(1)
//                .lineTotal(peda500g.getPrice())
//                .build();
//
//        order2.setItems(List.of(item2));
//
//        orderRepository.saveAll(List.of(order1, order2));

        // 5. Create Reviews
        Review review1 = Review.builder()
                .user(customer1)
                .product(ghee)
                .rating(5)
                .comment("Absolutely loved the pure A2 ghee. It reminds me of the traditional ghee from my village!")
                .approved(true)
                .build();

        Review review2 = Review.builder()
                .user(customer2)
                .product(ghee)
                .rating(4)
                .comment("Great quality, but packaging could be better. Overall very satisfied.")
                .approved(false) // Pending review
                .build();

        reviewRepository.saveAll(List.of(review1, review2));

        // 6. Create FAQ
        Faq faq1 = Faq.builder()
                .question("Is the A2 Ghee made using the Bilona method?")
                .answer("Yes, our A2 ghee is prepared using the traditional wooden Bilona churning method to ensure maximum purity and nutrition.")
                .displayOrder(1)
                .build();
        
        Faq faq2 = Faq.builder()
                .question("Do you deliver across India?")
                .answer("Yes, we provide pan-India delivery with secure packaging.")
                .displayOrder(2)
                .build();

        faqRepository.saveAll(List.of(faq1, faq2));

        // 7. Create Why Choose Us
        WhyChooseUs wcu1 = WhyChooseUs.builder()
                .title("100% Pure & Natural")
                .description("We guarantee that our products are free from any adulteration or chemicals.")
                .build();

        WhyChooseUs wcu2 = WhyChooseUs.builder()
                .title("Traditional Methods")
                .description("We stick to our roots. Our ghee is made using the ancient Bilona method.")
                .build();

        whyChooseUsRepository.saveAll(List.of(wcu1, wcu2));

        // 8. Create How It Works
        HowItWorks hiw1 = HowItWorks.builder()
                .title("The Bilona Churning Process")
                .description("Watch how our traditional bidirectional churning extracts the purest form of natural goodness.")
                .videoUrl("https://www.youtube.com/watch?v=1F3hm6MfR1k")
                .build();

        howItWorksRepository.save(hiw1);

        // 9. Create Contact Queries
        ContactQuery query1 = ContactQuery.builder()
                .name("Rahul Sharma")
                .email("rahul.s@example.com")
                .subject("Bulk Order Inquiry")
                .message("Hi, I would like to place a bulk order of 50L A2 Ghee for a wedding. What is the process?")
                .resolved(false)
                .build();
        
        ContactQuery query2 = ContactQuery.builder()
                .name("Priya K")
                .email("priya.k@example.com")
                .subject("Shipping delay")
                .message("My order ORD-12345678 hasn't arrived yet. Please update me on the status.")
                .resolved(true)
                .build();

        contactQueryRepository.saveAll(List.of(query1, query2));

        System.out.println("Dummy data seeding completed!");
    }
}
