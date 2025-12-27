package com.smartbasket.backend.service;

import com.smartbasket.backend.dto.CreateMarketRequest;
import com.smartbasket.backend.dto.MarketDto;
import com.smartbasket.backend.mapper.MarketMapper;
import com.smartbasket.backend.model.Market;
import com.smartbasket.backend.repository.MarketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarketService {

    private final MarketRepository marketRepository;
    private final MarketMapper marketMapper;

    public List<MarketDto> getAllMarkets() {
        return marketRepository.findAll()
                .stream()
                .map(marketMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<MarketDto> getActiveMarkets() {
        return marketRepository.findByActiveTrue()
                .stream()
                .map(marketMapper::toDto)
                .collect(Collectors.toList());
    }

    public Optional<MarketDto> getMarketById(String id) {
        return marketRepository.findById(id)
                .map(marketMapper::toDto);
    }

    public MarketDto createMarket(CreateMarketRequest request) {
        Market entity = marketMapper.toEntity(request);
        Market saved = marketRepository.save(entity);
        return marketMapper.toDto(saved);
    }

    public Optional<MarketDto> updateMarket(String id, CreateMarketRequest request) {
        return marketRepository.findById(id)
                .map(existing -> {
                    existing.setName(request.getName());
                    existing.setLocation(request.getLocation());
                    existing.setLogoUrl(request.getLogoUrl());
                    return marketRepository.save(existing);
                })
                .map(marketMapper::toDto);
    }

    public Optional<MarketDto> toggleMarketStatus(String id) {
        return marketRepository.findById(id)
                .map(existing -> {
                    existing.setActive(!existing.isActive());
                    return marketRepository.save(existing);
                })
                .map(marketMapper::toDto);
    }

    public boolean deleteMarket(String id) {
        if (marketRepository.existsById(id)) {
            marketRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
