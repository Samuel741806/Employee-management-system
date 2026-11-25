package com.ems.service;

import com.ems.model.Employee;
import com.ems.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmployeeService {
    private final EmployeeRepository repository;

    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }

    public List<Employee> getAll(String search) {
        if (search == null || search.isBlank()) return repository.findAll();
        return repository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search);
    }

    public Employee getById(String id) {
        return repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + id));
    }

    public Employee create(Employee employee) {
        employee.setId(null);
        return repository.save(employee);
    }

    public Employee update(String id, Employee input) {
        Employee existing = getById(id);
        existing.setName(input.getName());
        existing.setEmail(input.getEmail());
        existing.setDepartment(input.getDepartment());
        existing.setDesignation(input.getDesignation());
        existing.setSalary(input.getSalary());
        existing.setPhone(input.getPhone());
        existing.setStatus(input.getStatus());
        return repository.save(existing);
    }

    public void delete(String id) {
        Employee existing = getById(id);
        repository.delete(existing);
    }

    public long count() { return repository.count(); }
}
