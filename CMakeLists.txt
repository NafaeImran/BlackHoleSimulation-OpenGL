cmake_minimum_required(VERSION 3.20)

project(BlackHoleSimulation-OpenGL C CXX)

set(CMAKE_CXX_STANDARD 20)

find_package(OpenGL REQUIRED)

add_subdirectory(external/glfw-3.4)

include_directories(external/glad/include)
include(FetchContent)

FetchContent_Declare(
        glm
        GIT_REPOSITORY https://github.com/g-truc/glm.git
        GIT_TAG        1.0.1
)

FetchContent_MakeAvailable(glm)
add_executable(OpenGL
        main.cpp
        external/glad/src/glad.c
        shader.h
)


target_link_libraries(OpenGL PRIVATE
        glfw
        OpenGL::GL
        glm::glm
)