package com.eduflow.service;

import com.eduflow.dto.TeacherRequest;
import com.eduflow.dto.TeacherResponse;
import com.eduflow.dto.TeacherUpdateRequest;
import com.eduflow.entity.User;
import com.eduflow.exception.EmailAlreadyExistsException;
import com.eduflow.exception.TeacherNotFoundException;
import com.eduflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<TeacherResponse> listTeachers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == User.Role.TEACHER)
                .map(this::toResponse)
                .toList();
    }

    public TeacherResponse createTeacher(TeacherRequest request) {
        checkEmailFree(request.getEmail());
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.TEACHER)
                .build();
        return toResponse(userRepository.save(user));
    }

    public TeacherResponse updateTeacher(Long id, TeacherUpdateRequest request) {
        User user = getTeacherOrThrow(id);
        if (!user.getEmail().equalsIgnoreCase(request.getEmail())) {
            checkEmailFree(request.getEmail());
        }
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        return toResponse(userRepository.save(user));
    }

    public void deleteTeacher(Long id) {
        User user = getTeacherOrThrow(id);
        userRepository.delete(user);
    }

    private User getTeacherOrThrow(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new TeacherNotFoundException("Teacher not found with id: " + id));
        if (user.getRole() != User.Role.TEACHER) {
            throw new TeacherNotFoundException("Teacher not found with id: " + id);
        }
        return user;
    }

    private void checkEmailFree(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email already registered: " + email);
        }
    }

    private TeacherResponse toResponse(User user) {
        return new TeacherResponse(user.getId(), user.getName(), user.getEmail());
    }
}