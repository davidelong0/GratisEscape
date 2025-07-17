package com.example.gratisescape.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {

    @RequestMapping(value = {
            "/chat/{path:[^\\.]*}",
            "/favourites",
            "/profilo",
            "/viaggi/**",
            "/richieste",
            "/change-password-first",
            "/le-mie-richieste",
            "/admin/**"
    })
    public String forwardReactRoutes() {
        return "forward:/index.html";
    }
}
