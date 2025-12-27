package com.smartbasket.backend.mapper;

import com.smartbasket.backend.dto.CreateMarketRequest;
import com.smartbasket.backend.dto.MarketDto;
import com.smartbasket.backend.model.Market;
import org.springframework.stereotype.Component;

@Component
public class MarketMapper {

    public MarketDto toDto(Market entity) {
        if (entity == null) {
            return null;
        }
        return MarketDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .location(entity.getLocation())
                .logoUrl(entity.getLogoUrl())
                .active(entity.isActive())
                .build();
    }

    public Market toEntity(CreateMarketRequest request) {
        if (request == null) {
            return null;
        }
        return Market.builder()
                .name(request.getName())
                .location(request.getLocation())
                .logoUrl(request.getLogoUrl())
                .active(true)
                .build();
    }
}
