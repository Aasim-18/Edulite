package com.eduflow.service;

import com.eduflow.entity.SchoolClass;
import com.eduflow.exception.DuplicateResourceException;
import com.eduflow.exception.SchoolClassNotFoundException;
import com.eduflow.repository.SchoolClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassService {

    private final SchoolClassRepository classRepository;

    public List<SchoolClass> listClasses() {
        return classRepository.findAll();
    }

    public SchoolClass createClass(String name) {
        if (classRepository.existsByName(name)) {
            throw new DuplicateResourceException("Class already exists: " + name);
        }
        return classRepository.save(SchoolClass.builder().name(name).build());
    }

    public SchoolClass updateClass(Long id, String name) {
        SchoolClass schoolClass = getClassOrThrow(id);
        if (classRepository.existsByName(name)) {
            throw new DuplicateResourceException("Class already exists: " + name);
        }
        schoolClass.setName(name);
        return classRepository.save(schoolClass);
    }

    public void deleteClass(Long id) {
        SchoolClass schoolClass = getClassOrThrow(id);
        classRepository.delete(schoolClass);
    }

    public SchoolClass getClassOrThrow(Long id) {
        return classRepository.findById(id)
                .orElseThrow(() -> new SchoolClassNotFoundException("Class not found with id: " + id));
    }
}