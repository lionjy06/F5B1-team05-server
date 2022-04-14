
import { UseGuards } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { query } from "express";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { RolesGuard } from "src/common/auth/gql-role.guard";
import { Roles } from "src/common/auth/gql-role.param";
import { CurrentUser, ICurrentUser } from "src/common/auth/gql-user.param";
import { MainCategory } from "../mainCategory/entities/mainCategory.entity";
import { Role } from "../user/entities/user.entity";

import { CreateProductInput } from "./dto/createProductInput";
import { UpdateProductInput } from "./dto/updateProductIntput";
import { Product } from "./entities/product.entity";
import { ProductService } from "./product.service";

@Resolver()
export class ProductResolver {
  constructor(
    private readonly productSerivce: ProductService,
    private readonly elasticsearchService: ElasticsearchService
  ) {}

  @Query(() => [Product])
  async fetchproductsearch(
    @Args("searchKeyword") searchKeyword: string
  ) {
    const result = await this.elasticsearchService.search({
      index: "teamproject",
      query: {
        bool: {
          should: [
            { match: { name: searchKeyword } },
            { match: { uname: searchKeyword } },
          ],
        },
      },
    });
    const returnVal = result.hits.hits.map((val: any) => {
      return {
        product_id: val._source.product_id,
        name: val._source.name,
        price: val._source.price,
        urls: val._source.urls,
        user: {
          name: val._source.uname,
        },
      };
    });
    return returnVal;
  }

  @Query(() => [Product])
  async fetchProductBySearch(@Args("name") name: string) {
    return await this.productSerivce.findBySearch({ name });
  }

  @Query(() => [Product])
  async fetchProductByMainCatSubCatBrandPriceName(
    @Args("mainCategoryName", { nullable: true }) mainCategoryName?: string,
    @Args("subCategoryName", { nullable: true }) subCategoryName?: string,
    @Args("brandName", { nullable: true }) brandName?: string,
    @Args("productName", { nullable: true }) productName?: string,
    @Args("minPrice", { nullable: true }) minPrice?: number,
    @Args("maxPrice", { nullable: true }) maxPrice?: number
  ) {
    return await this.productSerivce.findByRadio({
      mainCategoryName,
      subCategoryName,
      brandName,
      productName,
      minPrice,
      maxPrice,
    });
  }

  @Query(() => [Product])
  async fetchAllProduct() {
    return await this.productSerivce.fetchAllProduct();
  }
  @Query(() => Product)
  async fetchProduct(@Args("productId") productId: string) {
    return await this.productSerivce.findOne({ productId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Product)
  async createProduct(
    @CurrentUser() currentUser: ICurrentUser,
    @Args("createProductInput") createProductInput: CreateProductInput
  ) {
    console.log(currentUser);
    return await this.productSerivce.create({
      createProductInput,
      currentUser,
    });
  }
  @Query(() => [Product])
  async fetchProductRelateMainCategory(@Args("name") name: string) {
    return await this.productSerivce.findProductRelateMainCategory({ name });
  }

  @Query(() => [Product])
  async fetchSellerProduct(@Args("userId") userId: string) {
    return await this.productSerivce.findSellerProduct({ userId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Product)
  async updateProduct(
    @Args(`productId`) productId: string,
    @Args(`updateProductInput`) updateProductInput: UpdateProductInput
  ) {
    return this.productSerivce.update({ productId, updateProductInput });
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean)
  async deleteProduct(@Args("productId") productId: string) {
    return await this.productSerivce.delete({ productId });
  }
}