package com.agrilivestock.ecommerce.specification;

import com.agrilivestock.ecommerce.entity.Product;
import com.agrilivestock.ecommerce.entity.ProductVariant;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> filterProducts(
            String search,
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String weight,
            Boolean activeOnly
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (activeOnly == null || activeOnly) {
                predicates.add(criteriaBuilder.equal(root.get("active"), true));
            }

            if (search != null && !search.isBlank()) {
                String searchLike = "%" + search.trim().toLowerCase() + "%";
                Predicate nameLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchLike);
                Predicate descLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("shortDescription")), searchLike);
                predicates.add(criteriaBuilder.or(nameLike, descLike));
            }

            if (categoryId != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), categoryId));
            }

            if (minPrice != null || maxPrice != null || (weight != null && !weight.isBlank())) {
                Join<Product, ProductVariant> variantJoin = root.join("variants", JoinType.INNER);
                
                if (minPrice != null) {
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(variantJoin.get("price"), minPrice));
                }
                if (maxPrice != null) {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(variantJoin.get("price"), maxPrice));
                }
                if (weight != null && !weight.isBlank()) {
                    predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(variantJoin.get("weight")), weight.trim().toLowerCase()));
                }
            }

            query.distinct(true);
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
