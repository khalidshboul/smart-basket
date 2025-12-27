package com.smartbasket.backend.controller;

import com.smartbasket.backend.dto.BatchPriceUpdateRequest;
import com.smartbasket.backend.dto.BatchPriceUpdateResponse;
import com.smartbasket.backend.model.MarketPrice;
import com.smartbasket.backend.service.PriceUpdateService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prices")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PriceController {

    private final PriceUpdateService priceUpdateService;

    /**
     * Update a single item's price
     */
    @PostMapping
    public ResponseEntity<MarketPrice> updatePrice(
            @RequestParam @NotBlank String marketItemId,
            @RequestParam @NotNull @Min(0) Double price,
            @RequestParam(required = false) @Min(0) Double originalPrice,
            @RequestParam(required = false) String currency,
            @RequestParam(required = false) Boolean isPromotion) {
        
        MarketPrice updatedPrice = priceUpdateService.updatePrice(marketItemId, price, originalPrice, currency, isPromotion);
        return ResponseEntity.status(HttpStatus.CREATED).body(updatedPrice);
    }

    /**
     * Batch update prices for multiple items
     */
    @PostMapping("/batch")
    public ResponseEntity<BatchPriceUpdateResponse> batchUpdatePrices(
            @Valid @RequestBody BatchPriceUpdateRequest request) {
        
        BatchPriceUpdateResponse response = priceUpdateService.batchUpdatePrices(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get price history for a market item
     */
    @GetMapping("/history/{marketItemId}")
    public ResponseEntity<List<MarketPrice>> getPriceHistory(@PathVariable String marketItemId) {
        List<MarketPrice> history = priceUpdateService.getPriceHistory(marketItemId);
        return ResponseEntity.ok(history);
    }
}
