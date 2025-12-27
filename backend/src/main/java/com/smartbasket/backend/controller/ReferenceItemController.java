package com.smartbasket.backend.controller;

import com.smartbasket.backend.dto.CreateReferenceItemRequest;
import com.smartbasket.backend.dto.ReferenceItemDto;
import com.smartbasket.backend.exception.ResourceNotFoundException;
import com.smartbasket.backend.service.ReferenceItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/items")
@RequiredArgsConstructor
public class ReferenceItemController {

    private final ReferenceItemService referenceItemService;

    @GetMapping
    public ResponseEntity<List<ReferenceItemDto>> getAllItems() {
        return ResponseEntity.ok(referenceItemService.getAllItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReferenceItemDto> getItemById(@PathVariable String id) {
        return referenceItemService.getItemById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("ReferenceItem", "id", id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ReferenceItemDto>> getItemsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(referenceItemService.getItemsByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ReferenceItemDto>> searchItems(@RequestParam String query) {
        return ResponseEntity.ok(referenceItemService.searchItems(query));
    }

    @PostMapping
    public ResponseEntity<ReferenceItemDto> createItem(@Valid @RequestBody CreateReferenceItemRequest request) {
        ReferenceItemDto created = referenceItemService.createItem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReferenceItemDto> updateItem(
            @PathVariable String id,
            @Valid @RequestBody CreateReferenceItemRequest request) {
        return referenceItemService.updateItem(id, request)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("ReferenceItem", "id", id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        if (referenceItemService.deleteItem(id)) {
            return ResponseEntity.noContent().build();
        }
        throw new ResourceNotFoundException("ReferenceItem", "id", id);
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ReferenceItemDto> toggleItemStatus(@PathVariable String id) {
        return referenceItemService.toggleStatus(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("ReferenceItem", "id", id));
    }
}
