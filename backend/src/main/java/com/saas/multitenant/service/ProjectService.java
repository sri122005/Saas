package com.saas.multitenant.service;

import com.saas.multitenant.dto.ProjectDto;
import com.saas.multitenant.dto.ProjectRequest;
import com.saas.multitenant.exception.ResourceNotFoundException;
import com.saas.multitenant.model.Project;
import com.saas.multitenant.model.Tenant;
import com.saas.multitenant.repository.ProjectRepository;
import com.saas.multitenant.repository.TenantRepository;
import com.saas.multitenant.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TenantRepository tenantRepository;

    public ProjectDto createProject(ProjectRequest request) {
        Long tenantId = java.util.Objects.requireNonNull(SecurityUtils.getCurrentTenantId());
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .tenant(tenant)
                .build();

        @SuppressWarnings("null")
        Project savedProject = projectRepository.save(project);
        return mapToDto(savedProject);
    }

    public List<ProjectDto> getAllProjectsForCurrentTenant() {
        Long tenantId = java.util.Objects.requireNonNull(SecurityUtils.getCurrentTenantId());
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));

        return projectRepository.findByTenant(tenant).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ProjectDto mapToDto(Project project) {
        return ProjectDto.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .tenantId(project.getTenant().getId())
                .createdAt(project.getCreatedAt())
                .build();
    }
}
