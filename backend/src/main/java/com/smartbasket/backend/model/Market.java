package com.smartbasket.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "markets")
public class Market {
    @Id
    private String id;
    private String name;
    private String location;
    private String logoUrl;
    
    @Builder.Default
    private boolean active = false;
}
