package com.example.instazoo.repository;

import com.example.instazoo.entity.Post;
import com.example.instazoo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    //SELECT * FROM POST as p WHERE User='user' SORT DESC
    List<Post> findAllByUserOrderByCreatedDateDesc(User user);  // Найти всех пользователей сортировать посты когда они были созданы Desc - Сверху вниз.
    List<Post> findAllByOrderByCreatedDateDesc();
    Optional<Post> findPostByIdAndUser(Long id, User user);

}
