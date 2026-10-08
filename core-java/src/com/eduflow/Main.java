package com.eduflow;

import com.eduflow.dao.AttendanceDao;
import com.eduflow.dao.FeeDao;
import com.eduflow.dao.StudentDao;
import com.eduflow.model.AttendanceRecord;
import com.eduflow.model.FeeSummary;
import com.eduflow.model.Student;

import java.util.List;

public class Main {

    public static void main(String[] args) {
        StudentDao studentDao = new StudentDao();
        AttendanceDao attendanceDao = new AttendanceDao();
        FeeDao feeDao = new FeeDao();

        List<Student> students = studentDao.findAll();
        System.out.println("EduFlow Lite - JDBC student overview");
        System.out.println("------------------------------------");

        for (Student student : students) {
            System.out.printf("%s (%s) - %s%n", student.name(), student.rollNumber(), student.className());
            printFee(feeDao.findByStudent(student.id()).orElse(null));
            printAttendance(attendanceDao.findByStudent(student.id()));
            System.out.println();
        }
    }

    private static void printFee(FeeSummary fee) {
        if (fee == null) {
            System.out.println("  Fee: no fee record");
            return;
        }
        System.out.printf("  Fee: %s | paid=%s | pending=%s%n",
                fee.status(), fee.paidAmount(), fee.pendingAmount());
    }

    private static void printAttendance(List<AttendanceRecord> records) {
        long present = records.stream().filter(record -> "PRESENT".equals(record.status())).count();
        System.out.printf("  Attendance: %d records, %d present%n", records.size(), present);
    }
}
