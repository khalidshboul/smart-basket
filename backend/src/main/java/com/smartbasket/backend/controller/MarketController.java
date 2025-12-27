package com.smartbasket.backend.controller;

import com.smartbasket.backend.dto.CreateMarketRequest;
import com.smartbasket.backend.dto.MarketDto;
import com.smartbasket.backend.exception.ResourceNotFoundException;
import com.smartbasket.backend.service.MarketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/markets")
@RequiredArgsConstructor
public class MarketController {

    private final MarketService marketService;

    @GetMapping
    public ResponseEntity<List<MarketDto>> getAllMarkets() {
        return ResponseEntity.ok(marketService.getAllMarkets());
    }

    @GetMapping("/active")
    public ResponseEntity<List<MarketDto>> getActiveMarkets() {
        return ResponseEntity.ok(marketService.getActiveMarkets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MarketDto> getMarketById(@PathVariable String id) {
        return marketService.getMarketById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Market", "id", id));
    }

    @PostMapping
    public ResponseEntity<MarketDto> createMarket(@Valid @RequestBody CreateMarketRequest request) {
        MarketDto created = marketService.createMarket(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MarketDto> updateMarket(
            @PathVariable String id,
            @Valid @RequestBody CreateMarketRequest request) {
        return marketService.updateMarket(id, request)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Market", "id", id));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<MarketDto> toggleMarketStatus(@PathVariable String id) {
        return marketService.toggleMarketStatus(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Market", "id", id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMarket(@PathVariable String id) {
        if (marketService.deleteMarket(id)) {
            return ResponseEntity.noContent().build();
        }
        throw new ResourceNotFoundException("Market", "id", id);
    }
}
