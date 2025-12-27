package com.smartbasket.backend.mapper;

import com.smartbasket.backend.dto.CreateReferenceItemRequest;
import com.smartbasket.backend.dto.ReferenceItemDto;
import com.smartbasket.backend.model.ReferenceItem;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class ReferenceItemMapper {

    public ReferenceItemDto toDto(ReferenceItem entity) {
        if (entity == null) {
            return null;
        }
        return ReferenceItemDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .categoryId(entity.getCategoryId())
                .category(entity.getCategory())
                .description(entity.getDescription())
                .images(entity.getImages() != null ? entity.getImages() : new ArrayList<>())
                .availableInAllMarkets(entity.isAvailableInAllMarkets())
                .specificMarketIds(entity.getSpecificMarketIds() != null ? entity.getSpecificMarketIds() : new ArrayList<>())
                .linkedMarketIds(entity.getLinkedMarketIds() != null ? entity.getLinkedMarketIds() : new ArrayList<>())
                .active(entity.isActive())
                .build();
    }

    public ReferenceItem toEntity(CreateReferenceItemRequest request) {
        if (request == null) {
            return null;
        }
        return ReferenceItem.builder()
                .name(request.getName())
                .categoryId(request.getCategoryId())
                .description(request.getDescription())
                .images(request.getImages() != null ? request.getImages() : new ArrayList<>())
                .availableInAllMarkets(request.getAvailableInAllMarkets() != null ? request.getAvailableInAllMarkets() : true)
                .specificMarketIds(request.getSpecificMarketIds() != null ? request.getSpecificMarketIds() : new ArrayList<>())
                .build();
    }
}

