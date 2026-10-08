package com.eduflow.service;

import com.eduflow.dto.StudentRequest;
import com.eduflow.dto.StudentResponse;
import com.eduflow.dto.StudentUpdateRequest;
import com.eduflow.entity.SchoolClass;
import com.eduflow.entity.Student;
import com.eduflow.entity.User;
import com.eduflow.exception.DuplicateResourceException;
import com.eduflow.exception.EmailAlreadyExistsException;
import com.eduflow.exception.StudentNotFoundException;
import com.eduflow.repository.StudentRepository;
import com.eduflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ClassService classService;
    private final PasswordEncoder passwordEncoder;

    public List<StudentResponse> listStudents() {
        return studentRepository.findAllWithUserAndClass().stream()
                .map(this::toResponse)
                .toList();
    }

    public StudentResponse createStudent(StudentRequest request) {
        checkEmailFree(request.getEmail());
        checkRollNumberFree(request.getRollNumber());
        SchoolClass schoolClass = classService.getClassOrThrow(request.getClassId());

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.STUDENT)
                .build();
        userRepository.save(user);

        Student student = Student.builder()
                .user(user)
                .schoolClass(schoolClass)
                .rollNumber(request.getRollNumber())
                .build();
        return toResponse(studentRepository.save(student));
    }

    public StudentResponse updateStudent(Long id, StudentUpdateRequest request) {
        Student student = getStudentOrThrow(id);
        User user = student.getUser();

        if (!user.getEmail().equalsIgnoreCase(request.getEmail())) {
            checkEmailFree(request.getEmail());
        }
        if (!student.getRollNumber().equalsIgnoreCase(request.getRollNumber())) {
            checkRollNumberFree(request.getRollNumber());
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        student.setRollNumber(request.getRollNumber());
        student.setSchoolClass(classService.getClassOrThrow(request.getClassId()));

        studentRepository.save(student);
        userRepository.save(user);
        return toResponse(studentRepository.findByIdWithUserAndClass(student.getId())
                .orElse(student));
    }

    public void deleteStudent(Long id) {
        Student student = getStudentOrThrow(id);
        User user = student.getUser();
        studentRepository.delete(student);
        userRepository.delete(user);
    }

    public Student getStudentOrThrow(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));
    }

    public Student getStudentByUserId(Long userId) {
        return studentRepository.findByUserIdWithUserAndClass(userId)
                .orElseThrow(() -> new StudentNotFoundException("Student profile not found for user id: " + userId));
    }

    public StudentResponse getStudentResponseByUserId(Long userId) {
        return toResponse(getStudentByUserId(userId));
    }

    public List<StudentResponse> listStudentsByClass(Long classId) {
        classService.getClassOrThrow(classId);
        return studentRepository.findByClassIdWithUser(classId).stream()
                .map(this::toResponse)
                .toList();
    }

    private void checkEmailFree(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email already registered: " + email);
        }
    }

    private void checkRollNumberFree(String rollNumber) {
        if (studentRepository.existsByRollNumber(rollNumber)) {
            throw new DuplicateResourceException("Roll number already exists: " + rollNumber);
        }
    }

    private StudentResponse toResponse(Student student) {
        User user = student.getUser();
        return new StudentResponse(
                student.getId(),
                user.getName(),
                user.getEmail(),
                student.getRollNumber(),
                student.getSchoolClass().getId(),
                student.getSchoolClass().getName()
        );
    }
}