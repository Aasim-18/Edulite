package com.eduflow.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class ServiceLoggingAspect {

    @Around("execution(* com.eduflow.service.*.*(..))")
    public Object logServiceMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        long start = System.currentTimeMillis();

        log.info(">>> Entering {}", methodName);
        try {
            Object result = joinPoint.proceed();
            log.info("<<< {} completed in {} ms", methodName, System.currentTimeMillis() - start);
            return result;
        } catch (Throwable t) {
            log.error("<<< {} failed after {} ms: {}", methodName,
                    System.currentTimeMillis() - start, t.getMessage());
            throw t;
        }
    }
}